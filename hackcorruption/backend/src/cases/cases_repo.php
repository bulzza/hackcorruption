<?php
// backend/src/cases/cases_repo.php

declare(strict_types=1);

/**
 * Fetch all cases from database
 */
function case_list(PDO $pdo): array
{
    $stmt = $pdo->query("SELECT id, court, judge, decision_date, legal_area, summary FROM cases ORDER BY id ASC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
}

/**
 * Fetch a single case with all related details
 */
function case_get(PDO $pdo, string $caseId): ?array
{
    // Fetch basic case info
    $stmt = $pdo->prepare("SELECT id, court, judge, decision_date, legal_area, summary FROM cases WHERE id = :id");
    $stmt->execute([':id' => $caseId]);
    $case = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$case) {
        return null;
    }

    // Fetch case details
    $stmt = $pdo->prepare("SELECT case_type, case_subtype, basis_type, basis, articles, public_prosecutor_case FROM case_detail WHERE case_id = :id");
    $stmt->execute([':id' => $caseId]);
    $caseDetail = $stmt->fetch(PDO::FETCH_ASSOC) ?: [
        'case_type' => null,
        'case_subtype' => null,
        'basis_type' => null,
        'basis' => null,
        'articles' => null,
        'public_prosecutor_case' => null
    ];

    return array_merge($case, [
        'case_detail' => $caseDetail
    ]);
}

/**
 * Create a new case in the database
 */
function case_create(PDO $pdo, array $payload): array
{
    $id = trim((string)($payload['id'] ?? ''));
    $court = trim((string)($payload['court'] ?? ''));
    $judge = trim((string)($payload['judge'] ?? ''));
    $decisionDate = trim((string)($payload['decision_date'] ?? ''));
    $legalArea = trim((string)($payload['legal_area'] ?? ''));
    $summary = trim((string)($payload['summary'] ?? ''));

    if ($id === '' || $court === '') {
        throw new InvalidArgumentException("Missing required fields: id, court");
    }

    // Check if case already exists
    $stmt = $pdo->prepare("SELECT 1 FROM cases WHERE id = :id");
    $stmt->execute([':id' => $id]);
    if ($stmt->fetchColumn()) {
        throw new InvalidArgumentException("Case with id '$id' already exists");
    }

    // Insert case
    $stmt = $pdo->prepare("
        INSERT INTO cases (id, court, judge, decision_date, legal_area, summary)
        VALUES (:id, :court, :judge, :decision_date, :legal_area, :summary)
    ");
    $stmt->execute([
        ':id' => $id,
        ':court' => $court,
        ':judge' => $judge ?: null,
        ':decision_date' => $decisionDate ?: null,
        ':legal_area' => $legalArea ?: null,
        ':summary' => $summary ?: null
    ]);

    // Insert case details if provided
    $caseDetail = $payload['case_detail'] ?? [];
    if (!empty($caseDetail)) {
        $caseType = $caseDetail['case_type'] ?? null;
        $caseSubtype = $caseDetail['case_subtype'] ?? null;
        $basisType = $caseDetail['basis_type'] ?? null;
        $basis = $caseDetail['basis'] ?? null;
        $articles = $caseDetail['articles'] ?? null;
        $prosecutorCase = $caseDetail['public_prosecutor_case'] ?? null;

        $stmt = $pdo->prepare("
            INSERT INTO case_detail (case_id, case_type, case_subtype, basis_type, basis, articles, public_prosecutor_case)
            VALUES (:case_id, :case_type, :case_subtype, :basis_type, :basis, :articles, :public_prosecutor_case)
        ");
        $stmt->execute([
            ':case_id' => $id,
            ':case_type' => $caseType,
            ':case_subtype' => $caseSubtype,
            ':basis_type' => $basisType,
            ':basis' => $basis,
            ':articles' => $articles,
            ':public_prosecutor_case' => $prosecutorCase
        ]);
    }

    return case_get($pdo, $id) ?? [];
}

/**
 * Update an existing case
 */
function case_update(PDO $pdo, string $caseId, array $payload): array
{
    // Check if case exists
    $stmt = $pdo->prepare("SELECT 1 FROM cases WHERE id = :id");
    $stmt->execute([':id' => $caseId]);
    if (!$stmt->fetchColumn()) {
        throw new InvalidArgumentException("Case '$caseId' not found");
    }

    $court = trim((string)($payload['court'] ?? ''));
    $judge = trim((string)($payload['judge'] ?? ''));
    $decisionDate = trim((string)($payload['decision_date'] ?? ''));
    $legalArea = trim((string)($payload['legal_area'] ?? ''));
    $summary = trim((string)($payload['summary'] ?? ''));

    if ($court === '') {
        throw new InvalidArgumentException("Missing required field: court");
    }

    // Update case
    $stmt = $pdo->prepare("
        UPDATE cases 
        SET court = :court, judge = :judge, decision_date = :decision_date, 
            legal_area = :legal_area, summary = :summary
        WHERE id = :id
    ");
    $stmt->execute([
        ':id' => $caseId,
        ':court' => $court,
        ':judge' => $judge ?: null,
        ':decision_date' => $decisionDate ?: null,
        ':legal_area' => $legalArea ?: null,
        ':summary' => $summary ?: null
    ]);

    // Update case details if provided
    $caseDetail = $payload['case_detail'] ?? [];
    if (!empty($caseDetail)) {
        $caseType = $caseDetail['case_type'] ?? null;
        $caseSubtype = $caseDetail['case_subtype'] ?? null;
        $basisType = $caseDetail['basis_type'] ?? null;
        $basis = $caseDetail['basis'] ?? null;
        $articles = $caseDetail['articles'] ?? null;
        $prosecutorCase = $caseDetail['public_prosecutor_case'] ?? null;

        // Check if detail exists
        $stmt = $pdo->prepare("SELECT 1 FROM case_detail WHERE case_id = :id");
        $stmt->execute([':id' => $caseId]);
        $exists = $stmt->fetchColumn();

        if ($exists) {
            $stmt = $pdo->prepare("
                UPDATE case_detail 
                SET case_type = :case_type, case_subtype = :case_subtype, basis_type = :basis_type,
                    basis = :basis, articles = :articles, public_prosecutor_case = :public_prosecutor_case
                WHERE case_id = :case_id
            ");
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO case_detail (case_id, case_type, case_subtype, basis_type, basis, articles, public_prosecutor_case)
                VALUES (:case_id, :case_type, :case_subtype, :basis_type, :basis, :articles, :public_prosecutor_case)
            ");
        }

        $stmt->execute([
            ':case_id' => $caseId,
            ':case_type' => $caseType,
            ':case_subtype' => $caseSubtype,
            ':basis_type' => $basisType,
            ':basis' => $basis,
            ':articles' => $articles,
            ':public_prosecutor_case' => $prosecutorCase
        ]);
    }

    return case_get($pdo, $caseId) ?? [];
}

/**
 * Delete a case
 */
function case_delete(PDO $pdo, string $caseId): bool
{
    // Delete case details first (foreign key constraint)
    $stmt = $pdo->prepare("DELETE FROM case_detail WHERE case_id = :id");
    $stmt->execute([':id' => $caseId]);

    // Delete case
    $stmt = $pdo->prepare("DELETE FROM cases WHERE id = :id");
    $stmt->execute([':id' => $caseId]);

    return $stmt->rowCount() > 0;
}

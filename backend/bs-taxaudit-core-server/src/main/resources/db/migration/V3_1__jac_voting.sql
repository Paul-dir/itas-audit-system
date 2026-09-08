-- V3_1__jac_voting.sql - Advisory Voting System

CREATE TABLE t_advisory_voting (
    voting_id UUID PRIMARY KEY,
    case_id UUID NOT NULL UNIQUE REFERENCES t_committee_case(case_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    consensus_threshold INTEGER DEFAULT 60,
    voting_started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    voting_closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE t_committee_vote (
    vote_id UUID PRIMARY KEY,
    voting_id UUID NOT NULL REFERENCES t_advisory_voting(voting_id) ON DELETE CASCADE,
    case_id UUID NOT NULL REFERENCES t_committee_case(case_id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    vote_option VARCHAR(20) NOT NULL,
    reasoning TEXT,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(case_id, member_id)
);

CREATE TABLE t_voting_tally (
    tally_id UUID PRIMARY KEY,
    voting_id UUID NOT NULL UNIQUE REFERENCES t_advisory_voting(voting_id) ON DELETE CASCADE,
    approve_count INTEGER DEFAULT 0,
    reject_count INTEGER DEFAULT 0,
    more_info_count INTEGER DEFAULT 0,
    total_votes_cast INTEGER DEFAULT 0,
    consensus_percentage DECIMAL(5,2),
    voting_outcome VARCHAR(50),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_committee_vote_voting ON t_committee_vote(voting_id);
CREATE INDEX idx_committee_vote_member ON t_committee_vote(member_id);
CREATE INDEX idx_committee_vote_case ON t_committee_vote(case_id);
CREATE INDEX idx_advisory_voting_case ON t_advisory_voting(case_id);

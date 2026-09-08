package mor.itas.domain.exception;

/**
 * Exception thrown when a committee member attempts to vote twice on the same case
 */
public class DuplicateVoteException extends CommitteeCaseException {

    private final String memberId;
    private final String caseId;

    public DuplicateVoteException(String memberId, String caseId) {
        super("Member " + memberId + " has already voted on case " + caseId);
        this.memberId = memberId;
        this.caseId = caseId;
    }

    public String getMemberId() {
        return memberId;
    }

    public String getCaseId() {
        return caseId;
    }
}

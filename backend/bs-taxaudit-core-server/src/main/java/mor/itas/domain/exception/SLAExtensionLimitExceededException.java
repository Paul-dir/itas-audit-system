package mor.itas.domain.exception;

/**
 * Exception thrown when maximum SLA extension limit is exceeded
 */
public class SLAExtensionLimitExceededException extends CommitteeCaseException {

    private final int currentExtensionCount;
    private final int maximumExtensions;

    public SLAExtensionLimitExceededException(int currentExtensionCount, int maximumExtensions) {
        super(String.format("SLA extension limit exceeded. Current: %d, Maximum: %d", 
                currentExtensionCount, maximumExtensions));
        this.currentExtensionCount = currentExtensionCount;
        this.maximumExtensions = maximumExtensions;
    }

    public int getCurrentExtensionCount() {
        return currentExtensionCount;
    }

    public int getMaximumExtensions() {
        return maximumExtensions;
    }
}

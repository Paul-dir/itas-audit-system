package mor.itas.observability.audit;

public class ActorContextHolder {
    private static final ThreadLocal<String> ACTOR_ID = new ThreadLocal<>();

    public static void setActorId(String actorId) {
        ACTOR_ID.set(actorId);
    }

    public static String getActorId() {
        return ACTOR_ID.get() != null ? ACTOR_ID.get() : "SYSTEM";
    }

    public static void clear() {
        ACTOR_ID.remove();
    }
}

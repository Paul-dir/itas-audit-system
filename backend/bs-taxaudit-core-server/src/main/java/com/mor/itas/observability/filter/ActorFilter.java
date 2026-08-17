package com.mor.itas.observability.filter;

import com.mor.itas.observability.audit.ActorContextHolder;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ActorFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        if (request instanceof HttpServletRequest httpRequest) {
            String actorId = httpRequest.getHeader("X-Actor-Id");
            if (actorId != null && !actorId.isBlank()) {
                ActorContextHolder.setActorId(actorId);
            }
        }
        try {
            chain.doFilter(request, response);
        } finally {
            ActorContextHolder.clear();
        }
    }
}

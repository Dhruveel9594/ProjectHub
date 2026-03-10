package com.example.ProjectHub.Configuration;

import com.example.ProjectHub.Service.JWTService;
import com.example.ProjectHub.Service.MyUserDetailsService;
import com.example.ProjectHub.Service.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTFilter extends OncePerRequestFilter {

    // CHANGE: Replaced System.out.println with proper SLF4J logger.
    // System.out has no log levels, no timestamps, can't be configured.
    // Logger gives you [WARN], [ERROR] levels and works with your log config.
    private static final Logger log = LoggerFactory.getLogger(JWTFilter.class);

    @Autowired
    private JWTService jwtService;

    @Autowired
    private ApplicationContext context;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);

            //  Check blacklist BEFORE doing any JWT validation.
            // If this token was used to logout, reject it immediately.
            if (tokenBlacklistService.isBlacklisted(token)) {
                log.warn("Rejected blacklisted token for request: {}", request.getRequestURI());
                filterChain.doFilter(request, response);
                return;
            }

            try {
                username = jwtService.extractUsername(token);
            } catch (Exception e) {
                //  log.warn instead of System.out.println
                log.warn("Invalid JWT token on request to {}: {}", request.getRequestURI(), e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = context.getBean(MyUserDetailsService.class)
                    .loadUserByUsername(username);

            if (jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
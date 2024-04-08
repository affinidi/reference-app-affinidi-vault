package login.affinidi.client.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.web.server.WebSession;
import org.springframework.http.server.reactive.ServerHttpResponse;
import reactor.core.publisher.Mono;
import org.springframework.security.core.Authentication;
import java.net.URI;
import org.springframework.http.HttpStatus;

@Configuration
public class OAuth2SecurityConfig {

    /**
     * This method injects OpenId Connect provider authentication to 
     * every http request served by this application, along with the defined
     * exceptions
     * 
     * @param http
     * @return
     */
    @Bean
    SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .authorizeExchange(exchanges ->
                exchanges
                    .pathMatchers("/", "/error","/login","/images/*").permitAll()
                    .anyExchange().authenticated()
              )
              .logout((logout) -> logout.logoutUrl("/logout").logoutSuccessHandler(new ServerLogoutSuccessHandler() {
                    @Override
                    public Mono<Void> onLogoutSuccess(WebFilterExchange exchange, Authentication authentication) {
                        ServerHttpResponse response = exchange.getExchange().getResponse();
                        response.setStatusCode(HttpStatus.FOUND);
                        response.getHeaders().setLocation(URI.create("/"));
                        response.getCookies().remove("JSESSIONID");
                        return exchange.getExchange().getSession()
                            .flatMap(WebSession::invalidate);
                    }
                    }))
              .oauth2Login(Customizer.withDefaults());
        return http.build();
    }
}

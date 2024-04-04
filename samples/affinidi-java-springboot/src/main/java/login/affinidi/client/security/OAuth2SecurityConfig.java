package login.affinidi.client.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

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
              .oauth2Login(Customizer.withDefaults());
        return http.build();
    }
}

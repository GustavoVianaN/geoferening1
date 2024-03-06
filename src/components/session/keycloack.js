class KeycloakConfig {
    constructor() {
        this.initOptions = {
            url: 'https://192.168.13.117:9998/',
            realm: 'ipms-dev',
            clientId: 'portal-web',
            onLoad: 'check-sso',
            KeycloakResponseType: 'code',
            // Você pode descomentar a linha abaixo se precisar definir o silentCheckSsoRedirectUri
            // silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html"
        };
    }

    // Método para obter as opções de inicialização
    getInitOptions() {
        return this.initOptions;
    }

    // Você pode adicionar mais métodos aqui se precisar modificar as opções dinamicamente ou interagir com Keycloak
}

export default KeycloakConfig;

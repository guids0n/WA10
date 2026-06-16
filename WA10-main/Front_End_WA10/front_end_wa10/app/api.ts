const BASE_URL = "https://wa10-api.onrender.com";

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponseDTO {
    id: number;
    nome: string;
    email: string;
    tipoUsuario: "ADMIN" | "CLIENTE";
    mensagem: string;
    token?: string;
}

export interface RedefinirSenhaDTO {
    email: string;
    codigoOtp: string;
    novaSenha?: string;
}

export interface ContatoRequest {
    nome: string;
    telefone: string;
    email: string;
    mensagem: string;
}

export interface Usuario {
    id?: number;
    nome: string;
    cpf: string;
    email: string;
    senhaHash?: string | null;
    codigoOtp?: string | null;
    tipoUsuario?: "ADMIN" | "CLIENTE";
    telefone: string;
    ativo: boolean;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
}

export interface Documento {
    id?: number;
    uuid: string;
    nomeOriginal: string;
    pathArmazenamento: string;
    contentType: string;
    origem: string;
    proprietarioId: number;
}


async function requisicao<T>(endpoint: string, configuracao: RequestInit = {}): Promise<T> {
    const URL_FORMATADA = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${URL_FORMATADA}`;

    const headers = new Headers(configuracao.headers);

    if (!(configuracao.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    const resposta = await fetch(url, { ...configuracao, headers });

    if (!resposta.ok) {
        const textoErro = await resposta.text();
        throw new Error(textoErro || `Erro na requisição (Status: ${resposta.status})`);
    }

    if (resposta.status === 204) return null as T;

    const contentType = resposta.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return resposta.json() as Promise<T>;
    }

    return resposta.text() as unknown as T;
}

export const api = {

    auth: {
        login: (dados: LoginRequest) =>
            requisicao<LoginResponseDTO>("/api/v1/auth/login", { method: "POST", body: JSON.stringify(dados) }),

        definirSenha: (dados: RedefinirSenhaDTO) =>
            requisicao<string>("/api/v1/auth/definir-senha", { method: "POST", body: JSON.stringify(dados) }),

        esqueciSenha: (email: string) =>
            requisicao<string>(`/api/v1/auth/esqueci-senha?email=${encodeURIComponent(email)}`, { method: "POST" }),
    },

    contatos: {
        enviar: (dados: ContatoRequest) =>
            requisicao<string>("/api/contatos", { method: "POST", body: JSON.stringify(dados) }),
    },

    usuarios: {
        cadastrar: (dados: Partial<Usuario>) =>
            requisicao<Usuario>("/usuarios", { method: "POST", body: JSON.stringify(dados) }),

        listarTodos: () =>
            requisicao<Usuario[]>("/usuarios", { method: "GET" }),

        buscarPorId: (id: number | string) =>
            requisicao<Usuario>(`/usuarios/${id}`, { method: "GET" }),

        atualizar: (id: number | string, dados: Partial<Usuario>) =>
            requisicao<Usuario>(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(dados) }),

        alternarStatus: (id: number | string) =>
            requisicao<void>(`/usuarios/${id}`, { method: "PATCH" }),
    },

    documentos: {
        listarTodos: () =>
            requisicao<Documento[]>("/api/v1/documentos", { method: "GET" }),

        listarPorUsuario: (usuarioId: number | string) =>
            requisicao<Documento[]>(`/api/v1/documentos/usuario/${usuarioId}`, { method: "GET" }),

        deletar: (uuid: string) =>
            requisicao<void>(`/api/v1/documentos/${uuid}`, { method: "DELETE" }),

        upload: (formData: FormData) =>
            requisicao<Documento>("/api/v1/documentos/upload", { method: "POST", body: formData }),

        atualizar: (uuid: string, formData: FormData) =>
            requisicao<Documento>(`/api/v1/documentos/${uuid}`, { method: "PUT", body: formData }),
    }
};

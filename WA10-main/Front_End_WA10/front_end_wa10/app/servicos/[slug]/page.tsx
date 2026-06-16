"use client";
import { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/app/api";

interface ServicoConteudo {
    titulo: string;
    icone: string;
    descricao: string[];
}

const dadosServicos: Record<string, ServicoConteudo> = {
    "consultoria-contabil": {
        titulo: "Consultoria Contábil",
        icone: "/Icones/Servico_1.svg",
        descricao: [
            "A consultoria contábil da WA10 nasceu com o objetivo de contribuir para o crescimento sustentável dos negócios de nossos clientes.",
            "Nossa equipe de trabalho é formada por excelentes profissionais, sempre à disposição do cliente, para ouvi-lo e analisar suas reais necessidades. Contamos com técnicos especializados que conferem credibilidade e confiança.",
            "Não queremos ser apenas prestadores de serviços, acreditamos que a nossa responsabilidade coloca-nos na posição de time."
        ]
    },
    "abertura-de-empresas": {
        titulo: "Abertura de Empresas",
        icone: "/Icones/Servico_2.svg",
        descricao: [
            "O serviço de abertura de empresas da WA10 nasceu com o objetivo de transformar o seu sonho empreendedor em realidade, de forma ágil, segura e sem complicações burocráticas.",
            "Nossa equipe de trabalho é formada por excelentes profissionais, prontos para orientar você na escolha do melhor formato jurídico e no enquadramento tributário mais vantajoso. Contamos com especialistas que cuidam de todos os trâmites legais, conferindo tranquilidade desde o primeiro passo.",
            "Não queremos ser apenas despachantes de documentos, acreditamos que a nossa responsabilidade é atuar como parceiros desde o nascimento do seu negócio, pavimentando o caminho para o seu sucesso."
        ]
    },
    "gestao-financeira": {
        titulo: "Gestão Financeira",
        icone: "/Icones/Servico_3.svg",
        descricao: [
            "A gestão financeira da WA10 foi estruturada com o objetivo de proporcionar total clareza e controle sobre os recursos do seu negócio, impulsionando a sua lucratividade de forma sustentável.",
            "Nossa equipe de trabalho é formada por analistas dedicados, sempre à disposição para avaliar o seu fluxo de caixa, custos e indicadores de desempenho. Contamos com técnicos especializados e ferramentas inteligentes que entregam informações precisas para a sua tomada de decisão.",
            "Não queremos ser apenas emissores de relatórios, acreditamos que a nossa atuação constante coloca-nos na posição de aliados estratégicos para a saúde e o crescimento financeiro da sua empresa."
        ]
    },
    "assessoria-trabalhista": {
        titulo: "Assessoria Trabalhista",
        icone: "/Icones/Servico_4.svg",
        descricao: [
            "A assessoria trabalhista e previdenciária da WA10 tem como objetivo garantir que a sua empresa atue em total conformidade com a legislação, protegendo o seu patrimônio e prezando pelas relações com seus colaboradores.",
            "Nossa equipe de trabalho é formada por excelentes profissionais, rigorosamente atualizados com as constantes mudanças nas leis e normas previdenciárias. Contamos com especialistas que previnem riscos de passivos trabalhistas e asseguram a correta administração de todo o seu departamento pessoal.",
            "Não queremos ser apenas executores de folhas de pagamento, acreditamos que a nossa responsabilidade é promover um ambiente seguro e justo, fortalecendo a segurança jurídica do seu negócio."
        ]
    },
    "regularizacao-fiscal": {
        titulo: "Regularização Fiscal",
        icone: "/Icones/Servico_5.svg",
        descricao: [
            "O serviço de regularização de pendências fiscais da WA10 surgiu com o objetivo de devolver a tranquilidade ao empreendedor, solucionando impasses com os órgãos governamentais de maneira rápida e definitiva.",
            "Nossa equipe de trabalho é formada por contadores e auditores experientes, sempre prontos para realizar um diagnostic profundo da situação da sua empresa. Contamos com técnicos especializados que mapeiam, negociam e regularizam débitos, evitando multas e restrições operacionais.",
            "Não queremos ser apenas solucionadores de problemas pontuais, acreditamos que o nosso compromisso é restabelecer a sua conformidade para que você possa focar no que realmente importa: fazer a sua empresa crescer."
        ]
    },
    "atendimento-remoto": {
        titulo: "Atendimento Remoto",
        icone: "/Icones/Servico_6.svg",
        descricao: [
            "O atendimento remoto da WA10 foi desenvolvido com o objetivo de derrubar barreiras geográficas, oferecendo suporte contábil e consultivo de alta qualidade onde quer que a sua empresa esteja.",
            "Nossa equipe de trabalho está plenamente capacitada para utilizar as melhores tecnologias de comunicação, garantindo que você seja ouvido com a mesma dedicação de um encontro presencial. Contamos com sistemas digitais integrados que conferem agilidade, segurança e eficiência na troca de informações.",
            "Não queremos ser apenas um contato do outro lado da tela, acreditamos que a conectividade contínua nos coloca lado a lado com o cliente, acompanhando o dia a dia do seu negócio em tempo real."
        ]
    }
};

export default function PaginaServico() {
    const { slug } = useParams();
    const router = useRouter();
    const servico = dadosServicos[slug as string];

    const [menuAberto, setMenuAberto] = useState(false);
    const alternarMenu = () => setMenuAberto(!menuAberto);
    const [mostrarBotoes, setMostrarBotoes] = useState(false);

    const [slideAtual, setSlideAtual] = useState(0);
    const proximoSlide = () => { setSlideAtual((prev) => (prev === 2 ? 0 : prev + 1)); };
    const slideAnterior = () => { setSlideAtual((prev) => (prev === 0 ? 2 : prev - 1)); };

    useEffect(() => {
        const timer = setInterval(proximoSlide, 5000);
        const checkScrollPosition = () => {
            if (window.scrollY > 120) { setMostrarBotoes(true); } else { setMostrarBotoes(false); }
        };
        window.addEventListener('scroll', checkScrollPosition);
        return () => { clearInterval(timer); window.removeEventListener('scroll', checkScrollPosition); };
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formulario = e.currentTarget;
        const formData = new FormData(formulario);

        const dadosContato = {
            nome: formData.get("nome") as string,
            telefone: formData.get("telefone") as string,
            email: formData.get("email") as string,
            mensagem: formData.get("mensagem") as string,
        };

        try {

            const mensagemSucesso = await api.contatos.enviar(dadosContato);
            alert(mensagemSucesso || "Mensagem enviada com sucesso!");
            formulario.reset();
        } catch (err) {

            const msgErro = err instanceof Error ? err.message : "Erro ao conectar com o servidor backend.";
            alert(msgErro);
        }
    };

    if (!servico) return <div style={{ padding: '100px', textAlign: 'center', fontFamily: 'Inter' }}>Serviço não encontrado.</div>;

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            {/* NAVBAR */}
            <nav>
                <div className="nav-conteudo">
                    <Link href="/"><img className="logo-menu" src="/Icones/Logo.svg" alt="Logo WA10" /></Link>
                    <div className="menu-links" id="menu-links-pc">
                        <Link href="/#pag-servicos"><b>SERVIÇOS</b></Link>
                        <Link href="/#pag-sobre"><b>SOBRE NÓS</b></Link>
                        <Link href="/#pag-contato"><b>CONTATO</b></Link>
                        <Link href="/login-cliente" className="botao-portal"><b>ÁREA DO CLIENTE</b></Link>
                    </div>
                </div>
                <button className={`menu-hamburguer ${menuAberto ? 'ativo' : ''}`} onClick={alternarMenu}>
                    <span className="linha"></span><span className="linha"></span><span className="linha"></span>
                </button>
            </nav>

            {/* HEADER / CARROSSEL - IDÊNTICO À HOMEPAGE */}
            <header>
                <div className="carousel">
                    <div className="carousel-inner">
                        {/* SLIDE 1: CONSULTORIA CONTÁBIL */}
                        <div className={`carousel-item ${slideAtual === 0 ? 'active' : ''}`}>
                            <img className="slide" src="/img/Banner1.jpg" alt="Consultoria Contábil" />
                            <div className="sobreposicao-slide">
                                <div className="conteudo-alinhado-d-slide">
                                    <h1 className="titulo-legenda">Consultoria Contábil</h1>
                                    <p className="texto-servico">Transformamos seus dados contábeis em estratégias inteligentes para o crescimento do seu negócio.</p>
                                </div>
                                <div className="conteudo-alinhado-e-slide">
                                    <div className="logo"><img id="logo" src="/Icones/Logo.svg" alt="Logo WA10" /></div>
                                    <p className="texto-acao">Entre em contato conosco e saiba mais sobre nossos services.</p>
                                    <button className="botao-acao"><Link href="/#pag-contato">Entre em contato</Link></button>
                                </div>
                            </div>
                        </div>

                        {/* SLIDE 2: ATENDIMENTO REMOTO */}
                        <div className={`carousel-item ${slideAtual === 1 ? 'active' : ''}`}>
                            <img className="slide" src="/img/Banner2.jpg" alt="Atendimento Remoto" />
                            <div className="sobreposicao-slide">
                                <div className="conteudo-alinhado-d-slide">
                                    <h1 className="titulo-legenda">Atendimento Remoto</h1>
                                    <p className="texto-servico">Fale com nossos especialistas com a mesma segurança de uma reunião presencial, mas com a agilidade que só o ambiente digital oferece.</p>
                                </div>
                                <div className="conteudo-alinhado-e-slide">
                                    <div className="logo"><img id="logo" src="/Icones/Logo.svg" alt="Logo WA10" /></div>
                                    <p className="texto-acao">Experimente a praticidade do nosso atendimento digital</p>
                                    <button className="botao-acao"><Link href="/#pag-contato">Entre em Contato</Link></button>
                                </div>
                            </div>
                        </div>

                        {/* SLIDE 3: GESTÃO FINANCEIRA */}
                        <div className={`carousel-item ${slideAtual === 2 ? 'active' : ''}`}>
                            <img className="slide" src="/img/Banner3.jpg" alt="Gestão Financeira" />
                            <div className="sobreposicao-slide">
                                <div className="conteudo-alinhado-d-slide">
                                    <h1 className="titulo-legenda">Gestão Financeira</h1>
                                    <p className="texto-servico">Deixe a rotina financeira conosco e ganhe mais tempo para focar no que realmente importa: o crescimento da sua empresa.</p>
                                </div>
                                <div className="conteudo-alinhado-e-slide">
                                    <div className="logo"><img id="logo" src="/Icones/Logo.svg" alt="Logo WA10" /></div>
                                    <p className="texto-acao">Descubra como podemos cuidar do seu financeiro.</p>
                                    <button className="botao-acao"><Link href="/#pag-contato">Entre em contato</Link></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" onClick={slideAnterior}> ❮ </button>
                    <button className="carousel-control-next" onClick={proximoSlide}> ❯ </button>
                </div>
            </header>

            {/* TITULO DA SEÇÃO */}
            <div style={{ backgroundColor: '#0C3851', color: 'white', textAlign: 'center', padding: '25px 0' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {servico.titulo}
                </h2>
            </div>

            {/* CONTEÚDO PRINCIPAL */}
            <main style={{ padding: '60px 20px 80px 20px', backgroundColor: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', gap: '80px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '400px', display: 'flex', justifyContent: 'center' }}>
                        <img src={servico.icone} alt={servico.titulo} style={{ width: '100%', maxWidth: '450px', height: 'auto' }} />
                    </div>
                    <div style={{ flex: '1.3', minWidth: '350px', paddingTop: '10px' }}>
                        {servico.descricao.map((p: string, i: number) => (
                            <p key={i} style={{ marginBottom: '30px', lineHeight: '1.8', fontSize: '1.15rem', color: '#333' }}>{p}</p>
                        ))}
                    </div>
                </div>
            </main>

            {/* FORMULÁRIO E CONTATOS */}
            <section id="pag-contato">
                <div className="formulario">
                    <h2 style={{ color: '#0C3851', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '1.8rem' }}>
                        FAÇA SUA {servico.titulo} CONOSCO!
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="nome" style={{ fontWeight: 'bold' }}>Nome:</label>
                        <input type="text" id="nome" name="nome" required placeholder="Digite seu nome" />

                        <label htmlFor="telefone" style={{ fontWeight: 'bold' }}>Telefone:</label>
                        <input type="tel" name="telefone" id="telefone" required placeholder="(XX) XXXXX-XXXX" pattern="\(\d{2}\) \d{5}-\d{4}" title="Formato: (XX) XXXXX-XXXX" />

                        <label htmlFor="email" style={{ fontWeight: 'bold' }}>E-mail:</label>
                        <input type="email" id="email" name="email" required placeholder="Digite seu e-mail" />

                        <label htmlFor="mensagem" style={{ fontWeight: 'bold' }}>Mensagem:</label>
                        <textarea id="mensagem" name="mensagem" rows={4} required placeholder="Escreva sua mensagem"></textarea>

                        <div className="botoes-form">
                            <button type="submit" className="botao-enviar"><b>Enviar</b></button>
                            <button type="button" onClick={() => router.push('/')} className="botao-cancelar"><b>Cancelar</b></button>
                        </div>
                    </form>

                    <div id="infos" style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
                            <div>
                                <h4 style={{ color: '#0C3851', fontWeight: 'bold', marginBottom: '8px' }}>Horário de atendimento</h4>
                                <p style={{ margin: 0, color: '#444' }}>Segunda a Sexta-feira das 08:00 às 18:00</p>
                            </div>
                            <div>
                                <h4 style={{ color: '#0C3851', fontWeight: 'bold', marginBottom: '8px' }}>Contatos</h4>
                                <p style={{ margin: 0, color: '#444' }}>contatowa@wacontabilidade.com.br</p>
                                <p style={{ margin: 0, color: '#444' }}>(61) 3361-1637 (61) 99174-1522</p>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ color: '#0C3851', fontWeight: 'bold', marginBottom: '8px' }}>Endereço</h4>
                            <p style={{ color: '#444', margin: 0 }}>
                                SIA Trecho 01, Lote 230, Ed. Bradesco, Salas 101, 102 e 109, Brasília - DF, CEP: 71.200-010.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BOTÕES FLUTUANTES */}
            <div id="bt-topo" className={mostrarBotoes ? 'show' : ''}><a href="#"><img src="/Icones/topo.svg" alt="Topo" /></a></div>
            <div id="whats" className={mostrarBotoes ? 'show' : ''}><img src="/Icones/logo-whatsapp.svg" alt="Whatsapp" /></div>
            <div id="insta" className={mostrarBotoes ? 'show' : ''}><img src="/Icones/logo_instagram.svg" alt="Instagram" /></div>
            <div id="face" className={mostrarBotoes ? 'show' : ''}><img src="/Icones/logo_facebook.svg" alt="Facebook" /></div>

            <footer style={{ backgroundColor: '#0C3851', color: 'white', textAlign: 'center' }}>
                <p>Todos os direitos reservados <strong>Eduardo Soares</strong> e <strong>Guidson Barreto</strong> 2026</p>
            </footer>
        </div>
    );
}
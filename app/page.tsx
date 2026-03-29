"use client";
import {useState, useEffect} from "react";

export default function Home() {
  const [menuAberto, setMenuAberto] = useState(false);
  const alternarMenu = () => setMenuAberto(!menuAberto);

  const [slideAtual, setSlideAtual] = useState(0);
  const proximoSlide = () => {setSlideAtual((prev) => (prev === 2 ? 0 : prev + 1));};
  const slideAnterior = () => {setSlideAtual((prev) => (prev === 0 ? 2 : prev - 1));};

  const [mostrarBotoes, setMostrarBotoes] = useState(false);
      useEffect(() => {

          const checkScrollPosition = () => {
              if (window.scrollY > 120) {
                  setMostrarBotoes(true); 
              } else {
                  setMostrarBotoes(false); 
              }
          };

          window.addEventListener('scroll', checkScrollPosition);

          checkScrollPosition();

          return () => {
              window.removeEventListener('scroll', checkScrollPosition);
          };
      }, []);

  return (
    <>
      <nav>
        <div className="nav-conteudo">
          <a href="#" className="logo-menu">
            <img className="logo-menu" src="/Icones/Logo.svg" alt="Logo WA10" />
          </a>

          <div className="menu-links" id="menu-links-pc">
            <a href="#pag-servicos"><b>SERVIÇOS</b></a>
            <a href="#pag-sobre"><b>SOBRE NÓS</b></a>
            <a href="#pag-contato"><b>CONTATO</b></a>
            <a href="/login-cliente" className="botao-portal"><b>ÁREA DO CLIENTE</b></a>
          </div>

          <div className="pesquisa-container" id="pesquisa-container">
            <input type="search" className="search-input" id="search-input" placeholder="Pesquisar" />
            <button className="botao-pesquisa" id="botao-pesquisa" aria-label="Abrir/Fechar pesquisa">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className={`menu-lateral ${menuAberto ? 'ativo' : ''}`} id="menu-lateral">
          <a href="#pag-servicos" onClick={alternarMenu}><b>SERVIÇOS</b></a>
          <a href="#pag-sobre" onClick={alternarMenu}><b>SOBRE NÓS</b></a>
          <a href="#pag-contato" onClick={alternarMenu}><b>CONTATO</b></a>
          <a href="/login-cliente" className="botao-portal-mobile" onClick={alternarMenu}><b>ÁREA DO CLIENTE</b></a>
        </div>

        <button 
          className={`menu-hamburguer ${menuAberto ? 'ativo' : ''}`} 
          id="menu-hamburguer" 
          aria-label="Abrir menu"
          onClick={alternarMenu}
        >
          <span className="linha"></span>
          <span className="linha"></span>
          <span className="linha"></span>
        </button>
      </nav>

      <header>
        <div className="carousel">
          <div className="carousel-inner">
            <div className={`carousel-item ${slideAtual === 0 ? 'active' : ''}`}>
              <img className="slide" src="/img/Banner1.jpg" alt="Pessoa digitando em um laptop" />
              <div className="sobreposicao-slide">
                <div className="conteudo-alinhado-d-slide">
                  <h1 className="titulo-legenda">Consultoria Contábil</h1>
                  <p className="texto-servico">Transformamos seus dados contábeis em estratégias inteligentes para o crescimento do seu negócio.</p>
                </div>
                <div className="conteudo-alinhado-e-slide">
                  <div className="logo"><img id="logo" src="/Icones/Logo.svg" alt="Logo WA10" /></div>
                  <p className="texto-acao">Entre em contato conosco e saiba mais sobre nossos serviços.</p>
                  <button className="botao-acao"><a href="#pag-contato">Entre em contato</a></button>
                </div>
              </div>
            </div>
            
            <div className={`carousel-item ${slideAtual === 1 ? 'active' : ''}`}>
              <img className="slide" src="/img/Banner2.jpg" alt="Pessoa apontando para documento" />
              <div className="sobreposicao-slide">
                <div className="conteudo-alinhado-d-slide">
                  <h1 className="titulo-legenda">Atendimento Remoto</h1>
                  <p className="texto-servico">Fale com nossos especialistas com a mesma segurança de uma reunião presencial, mas com a agilidade que só o ambiente digital oferece.</p>
                </div>
                <div className="conteudo-alinhado-e-slide">
                  <div className="logo"><img id="logo" src="/Icones/Logo.svg" alt="Logo WA10" /></div>
                  <p className="texto-acao">Experimente a praticidade do nosso atendimento digital</p>
                  <button className="botao-acao"><a href="#pag-contato">Entre em Contato</a></button>
                </div>
              </div>
            </div>
            
            <div className={`carousel-item ${slideAtual === 2 ? 'active' : ''}`}>
              <img className="slide" src="/img/Banner3.jpg" alt="Gráfico de crescimento" />
              <div className="sobreposicao-slide">
                <div className="conteudo-alinhado-d-slide">
                  <h1 className="titulo-legenda">Gestão Financeira</h1>
                  <p className="texto-servico">Deixe a rotina financeira conosco e ganhe mais tempo para focar no que realmente importa: o crescimento da sua empresa.</p>
                </div>
                <div className="conteudo-alinhado-e-slide">
                  <div className="logo"><img id="logo" src="/Icones/Logo.svg" alt="Logo WA10" /></div>
                  <p className="texto-acao">Descubra como podemos cuidar do seu financeiro.</p>
                  <button className="botao-acao"><a href="#pag-contato">Entre em contato</a></button>
                </div>
              </div>
            </div>
          </div>
          {/* Removi os onClick="prevSlide()" daqui para não dar erro */}
          <button className="carousel-control-prev" onClick={slideAnterior}> ❮ </button>
          <button className="carousel-control-next" onClick={proximoSlide}> ❯ </button>
        </div>
      </header>

      <article id="frase">
        <p>“O contador é a bússola de uma empresa. Com base nos elementos que ele fornece, o empresário sabe se vai ter sucesso ou insucesso. A Contabilidade dá uma dimensão do que passou e a projeção do futuro.”</p>
      </article>

      <main id="pag-servicos">
        <h2>SERVIÇOS</h2>
        <div id="servicos">
          <div className="card">
            <div className="icone"><img src="/Icones/Servico_1.svg" alt="Serviço 1" /></div>
            <div className="titulo-servico"><h4>Consultoria Contábil</h4></div>
            <div className="descricao-servico"><p className="p-card"> Análise e orientação de especialistas para suas decisões de negócio.</p></div>
          </div>
          <div className="card">
            <div className="icone"><img src="/Icones/Servico_2.svg" alt="Serviço 2" /></div>
            <div className="titulo-servico"><h4>Abertura de Empresas</h4></div>
            <div className="descricao-servico"><p className="p-card">Seu CNPJ emitido de forma rápida, correta e sem burocracia.</p></div>
          </div>
          <div className="card">
            <div className="icone"><img src="/Icones/Servico_3.svg" alt="Serviço 3" /></div>
            <div className="titulo-servico"><h4>Gestão Financeira</h4></div>
            <div className="descricao-servico"><p className="p-card">Tenha total visibilidade e controle do seu fluxo de caixa e contas.</p></div>
          </div>
          <div className="card">
            <div className="icone"><img src="/Icones/Servico_4.svg" alt="Serviço 4" /></div>
            <div className="titulo-servico"><h4>Assessoria Trabalhista e Previdenciária</h4></div>
            <div className="descricao-servico"><p className="p-card">Mantenha sua empresa em dia e livre de riscos e multas trabalhistas.</p></div>
          </div>
          <div className="card">
            <div className="icone"><img src="/Icones/Servico_5.svg" alt="Serviço 5" /></div>
            <div className="titulo-servico"><h4>Regularização de Pendências Fiscais</h4></div>
            <div className="descricao-servico"><p className="p-card">Solucionamos as pendências fiscais para sua empresa operar com tranquilidade.</p></div>
          </div>
          <div className="card">
            <div className="icone"><img src="/Icones/Servico_6.svg" alt="Serviço 6" /></div>
            <div className="titulo-servico"><h4>Atendimento Remoto</h4></div>
            <div className="descricao-servico"><p className="p-card">Sua contabilidade 100% digital. Resolva tudo online, de onde estiver.</p></div>
          </div>
        </div>
      </main>

      <section id="pag-sobre">
        <h2>SOBRE NÓS</h2>
        <div className="conteudo-sobre">
          <div id="foto-sobre">
            <img src="/img/Seção-sobre.jpg" alt="Analisando documentos" />
          </div>
          <div id="texto-sobre-nos">
            <p>WA10 Soluções Contábeis nasceu em 1996 com o objetivo de contribuir para o crescimento sustentável dos negócios de seus clientes.</p>
            <p>Nossa equipe de trabalho é formada por excelentes profissionais, sempre à disposição do cliente, para ouvi-lo e analisar suas reais necessidades. Contamos com técnicos especializados que conferem credibilidade e confiança.</p>
            <p>Não queremos ser apenas prestadores de serviços, acreditamos que a nossa responsabilidade frente às necessidades dos nossos clientes coloca-nos na posição de time, aquele que se apresenta ao seu lado em todos os trabalhos.</p>
          </div>
        </div>

        <div className="mvv-container">
          <div className="missao-visao-valores">
            <div className="sobre-icone"><img src="/Icones/missao.svg" alt="Missão" /></div>
            <div className="sobre-titulo"><h4>Missão</h4></div>
            <div className="sobre-texto"><p>Contribuir para o crescimento sustentável dos nossos clientes com soluções contábeis de confiança.</p></div>
          </div>
          <div className="missao-visao-valores">
            <div className="sobre-icone"><img src="/Icones/visao.svg" alt="Visão" /></div>
            <div className="sobre-titulo"><h4>Visão</h4></div>
            <div className="sobre-texto"><p>Ser a principal parceira no sucesso e crescimento de cada cliente, construindo relações de máxima confiança.</p></div>
          </div>
          <div className="missao-visao-valores">
            <div className="sobre-icone"><img src="/Icones/valores.svg" alt="Valores" /></div>
            <div className="sobre-titulo"><h4>Valores</h4></div>
            <div className="sobre-texto"><p>Parceria, Excelência e Confiança, Foco no Cliente e Comprometimento</p></div>
          </div>
        </div>
      </section>

      <section id="pag-contato">
        <h2>CONTATO</h2>
        <div className="formulario">
          <form action="#" method="get">
            <label htmlFor="nome">Nome:</label>
            <input type="text" id="nome" name="nome" required placeholder="Digite seu nome" />

            <label htmlFor="telefone">Telefone:</label>
            <input type="tel" name="telefone" id="telefone" required placeholder="(XX) XXXXX-XXXX" pattern="\(\d{2}\) \d{5}-\d{4}" title="Formato: (XX) XXXXX-XXXX" />

            <label htmlFor="email">E-mail:</label>
            <input type="email" id="email" name="email" required placeholder="Digite seu e-mail" />

            <label htmlFor="mensagem">Mensagem:</label>
            <textarea id="mensagem" name="mensagem" rows={4} required placeholder="Escreva sua mensagem"></textarea>

            <div className="botoes-form">
              <button type="submit" className="botao-enviar">Enviar</button>
              <button type="button" className="botao-cancelar">Cancelar</button>
            </div>
          </form>

          <div id="mapa">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.936165154478!2d-47.9538421!3d-15.8073196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a311fd2cb652d%3A0x65cdfd1df3371b3e!2zV0ExMCBTb2x1w6fDtWVzIENvbnTDoWJlaXM!5e0!3m2!1spt-BR!2sbr!4v1752683069348!5m2!1spt-BR!2sbr" width="100%" height="450" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>

        <div id="infos">
          <div className="funcionamento">
            <h4>Horário de atendimento</h4>
            <p>Segunda a Sexta-feira das 08:00 às 18:00</p>
          </div>
          <div className="funcionamento">
            <h4>Endereço</h4>
            <p>SIA Trecho 01, Lote 230, Ed. Bradesco, Salas 101, 102 e 109, Brasília - DF, CEP: 71.200-010.</p>
          </div>
          <div className="funcionamento">
            <h4>Contatos</h4>
            <p>contatowa@wacontabilidade.com.br </p>
            <p>(61) 3361-1637 (61) 99174-1522</p>
          </div>
        </div>
      </section>

      <div id="bt-topo" className={mostrarBotoes ? 'show' : ''}>
        <a href="#"><img src="/Icones/topo.svg" alt="Clique para voltar ao topo" /></a>
      </div>

      <div id="whats"className={mostrarBotoes ? 'show' : ''}>
        <img src="/Icones/logo-whatsapp.svg" alt="Logo Whatsapp" /></div>
      <div id="insta"className={mostrarBotoes ? 'show' : ''}>
        <img src="/Icones/logo_instagram.svg" alt="Logo Instagram" /></div>
      <div id="face"className={mostrarBotoes ? 'show' : ''}>
        <img src="/Icones/logo_facebook.svg" alt="Logo Facebook" /></div>

      <footer>
        <p>Todos os direitos reservados <strong>Eduardo Soares</strong> e <strong>Guidson Barreto</strong>  2025</p>
      </footer>
    </>
  );
}
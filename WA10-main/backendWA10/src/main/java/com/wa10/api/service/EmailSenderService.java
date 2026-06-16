package com.wa10.api.service;

import com.wa10.api.dto.ContatoRequest;
import com.wa10.api.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void enviarEmailOtp(String destinatario, String nome, String codigo) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("contato@wa10.com.br");
        message.setTo(destinatario);
        message.setSubject("WA10 - Seu Código de Acesso");
        message.setText("Olá, " + nome + "!\n\n" +
                "Seu código de verificação para o portal WA10 é: " + codigo + "\n" +
                "Este código expira em 15 minutos.\n\n" +
                "Caso não tenha solicitado este acesso, por favor ignore este e-mail.");

        try {
            mailSender.send(message);
        } catch (Exception e) {
            // 🚀 👉 ATUALIZADO: Mensagem de log genérica e adequada para o Mailpit local
            System.err.println("Erro ao enviar e-mail de OTP via Mailpit. Verifique se o servidor local está rodando: " + e.getMessage());
        }
    }

    @Override
    public void enviarEmailContato(ContatoRequest contato) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("contato@wa10.com.br");
        message.setTo("suporte@wa10.com.br");
        message.setSubject("Novo Contato pelo Site - " + contato.nome());

        String corpo = String.format(
                "Você recebeu uma nova mensagem através do site:\n\n" +
                        "👤 Nome: %s\n" +
                        "📞 Telefone: %s\n" +
                        "✉️ E-mail: %s\n\n" +
                        "📝 Mensagem:\n%s",
                contato.nome(),
                contato.telefone(),
                contato.email(),
                contato.mensagem()
        );

        message.setText(corpo);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            // 🚀 👉 ATUALIZADO: Log limpo sem referências a limites do Mailtrap
            System.err.println("Erro ao enviar formulário de contato via Mailpit: " + e.getMessage());
        }
    }

    @Override
    public void enviarEmailBoasVindasSemOtp(String destinatario, String nome) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("contato@wa10.com.br");
        message.setTo(destinatario);
        message.setSubject("WA10 - Conta criada! Ative seu acesso");

        String linkPortal = "http://localhost:3000/primeiro-acesso";

        message.setText("Olá, " + nome + "!\n\n" +
                "Sua conta no portal WA10 Soluções Contábeis foi criada com sucesso.\n" +
                "Para criar a sua senha e ativar o seu perfil de acesso, clique no link abaixo:\n\n" +
                linkPortal + "\n\n" +
                "Seja bem-vindo à WA10!");

        try {
            mailSender.send(message);
        } catch (Exception e) {
            // 🚀 👉 ATUALIZADO: Log adequado para o Mailpit local
            System.err.println("Erro ao enviar e-mail de boas-vindas via Mailpit: " + e.getMessage());
        }
    }
}
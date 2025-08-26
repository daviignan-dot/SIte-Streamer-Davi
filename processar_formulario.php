<?php
// Configurações
$destinatario = "davi.ignan@escola.pr.gov.br";
$assunto = "Nova mensagem do site de Davi Streamer";

// Verifica se o formulário foi submetido
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitiza e valida os dados do formulário
    $nome = filter_var(trim($_POST["nome"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $assunto_form = filter_var(trim($_POST["assunto"]), FILTER_SANITIZE_STRING);
    $mensagem = filter_var(trim($_POST["mensagem"]), FILTER_SANITIZE_STRING);
    
    // Verifica se todos os campos estão preenchidos
    if (empty($nome) || empty($email) || empty($assunto_form) || empty($mensagem)) {
        http_response_code(400);
        echo "Por favor, preencha todos os campos.";
        exit;
    }
    
    // Verifica se o email é válido
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Por favor, insira um endereço de email válido.";
        exit;
    }
    
    // Monta o corpo do email
    $corpo_email = "Você recebeu uma nova mensagem do formulário de contato do seu site:\n\n";
    $corpo_email .= "Nome: $nome\n";
    $corpo_email .= "Email: $email\n";
    $corpo_email .= "Assunto: $assunto_form\n";
    $corpo_email .= "Mensagem:\n$mensagem\n";
    
    // Cabeçalhos do email
    $headers = "From: $nome <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Envia o email
    if (mail($destinatario, $assunto, $corpo_email, $headers)) {
        http_response_code(200);
        echo "Obrigado! Sua mensagem foi enviada com sucesso.";
    } else {
        http_response_code(500);
        echo "Oops! Algo deu errado e não foi possível enviar sua mensagem.";
    }
} else {
    // Se não for método POST, retorna erro
    http_response_code(403);
    echo "Houve um problema com seu envio. Por favor, tente novamente.";
}
?>

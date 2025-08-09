const fs = require('fs');
const path = require('path');

// Armazena os IDs das mensagens já processadas
const processedMessages = new Set();

const getTabelaPrecos = () => {
    return `> ⓘ *❗️🔝MEGABYTE* *VODACOM* ...`.trim(); // pode manter igual
};

const handleTabela = async (sock, msg) => {
    const from = msg.key.remoteJid;
    const id = msg.key.id; // ID único da mensagem
    const isGroup = from.endsWith('@g.us');
    const mensagem = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text || 
                     '';

    const comando = mensagem.trim().toLowerCase();

    // ✅ 1. Verifica se já processou essa mensagem
    if (processedMessages.has(id)) {
        console.log(`🔁 Mensagem duplicada ignorada: ${id}`);
        return;
    }

    // ✅ 2. Marca como processada
    processedMessages.add(id);

    // ✅ 3. Só processa se for um dos comandos
    if (!['.n', '.t', '.i', '.s'].includes(comando)) {
        return; // Não é comando, ignora (ou pode enviar tabela, conforme lógica)
    }

    try {
        console.log(`✅ Comando recebido: "${comando}" no grupo ${from}`);

        const imagePath = (nomeArquivo) => path.join(__dirname, '..', 'fotos', nomeArquivo);
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        let participants = [];
        if (isGroup) {
            const groupMetadata = await sock.groupMetadata(from).catch(() => null);
            if (!groupMetadata) {
                return await sock.sendMessage(from, { text: '❌ Não foi possível carregar os dados do grupo.' });
            }
            participants = groupMetadata.participants.map(p => p.id);
        }

        // Função para enviar mensagem com menções
        const enviar = (content, mentionEveryone = false) => {
            const options = { ...content };
            if (mentionEveryone && participants && participants.length > 0) {
                options.mentions = participants;
            }
            return sock.sendMessage(from, options);
        };

        // Comando .n
        if (comando === '.n') {
            const imageBuffer = fs.readFileSync(imagePath('Netflix.jpeg'));
            await enviar({
                image: imageBuffer,
                caption: '🎬 Promoção Netflix Ativada!'
            });
            return;
        }

        // Comando .t
        if (comando === '.t') {
            const imageBuffer = fs.readFileSync(imagePath('tabela.jpg'));
            await enviar({
                image: imageBuffer,
                caption: '📊 Tabela Completa de Preços Atualizada!'
            });
            return;
        }

        // Comando .i
        if (comando === '.i') {
            const imageBuffer = fs.readFileSync(imagePath('ilimitado.png'));
            const legenda = `📞 TUDO TOP VODACOM\n📍Chamadas e SMS ilimitadas para Todas Redes\n\n📆30 dias Tudo top\n\n450MT 🔥☎ Chamadas + SMS ilimitadas + 11GB +10min Int+30MB Roam\n550MT 🔥☎ Chamadas + SMS ilimitadas + 16GB +10min Int+30MB Roam\n650MT 🔥☎ Chamadas + SMS ilimitadas + 21GB +10min Int+30MB Roam\n850MT 🔥☎ Chamadas + SMS ilimitadas + 31GB +10min Int+30MB Roam\n1080MT 🔥☎ Chamadas + SMS ilimitadas + 41GB +10min Int+30MB Roam\n1300MT 🔥☎ Chamadas + SMS ilimitadas + 51GB +10min Int+30MB Roam\n\n> TOPAINETGIGAS 🛜✅`;
            await enviar({
                image: imageBuffer,
                caption: legenda
            });
            return;
        }

        // Comando .s — Envia tudo em sequência, mas só a última mensagem menciona todos
        if (comando === '.s') {
            const imagens = [
                { nome: 'tabela.jpg', legenda: '📊 Tabela Completa de Preços Atualizada! \n🌐 Acesse nosso site oficial: https://topai-net-gigas.netlify.app/  ' },
                { nome: 'Netflix.jpeg', legenda: '🎬 Promoção Netflix Ativada!' },
                { nome: 'Netflix 2.jpg', legenda: '🎞️ Mais planos Netflix disponíveis! Aproveite antes que acabe! 💥' },
                { nome: 'spotify.jpg', legenda: '🎧 Spotify Premium disponível por tempo limitado! Garanta já o seu acesso VIP! 🔥' },
                { nome: 'ilimitado.png', legenda: `📞 TUDO TOP VODACOM\n
📍Chamadas e SMS ilimitadas para Todas Redes

📆30 dias Tudo top

450MT 🔥☎ Chamadas + SMS ilimitadas  + 11GB  +10min
Int+30MB Roam

550MT 🔥☎ Chamadas + SMS ilimitadas + 16GB  +10min
Int+30MB Roam

650MT 🔥☎ Chamadas + SMS ilimitadas + 21GB  +10min
Int+30MB Roam

850MT 🔥☎ Chamadas + SMS ilimitadas + 31GB  +10min
Int+30MB Roam

1080MT 🔥☎ Chamadas + SMS ilimitadas + 41GB +10min
Int+30MB Roam

1300MT 🔥☎ Chamadas + SMS ilimitadas + 51GB +10min
Int+30MB Roam

> TOPAINETGIGAS 🛜✅` },
                { nome: 'menu.jpeg', legenda: '🛍️ *CATÁLOGO DE SERVIÇOS* \nExplore nosso portfólio de serviços: 📲CVs, 📰Panfletos, 🖼️Cartazes e muito mais!\n\n🌐 Acesse: https://topai-net-gigas.netlify.app/    \n\nEstamos prontos para te atender com qualidade e agilidade! ✅' }
            ];

            // Enviar todas as imagens SEM menção
            for (const img of imagens) {
                const buffer = fs.readFileSync(imagePath(img.nome));
                await enviar({
                    image: buffer,
                    caption: img.legenda
                }, false); // sem menção
                await sleep(5000);
            }

            // Enviar formas de pagamento SEM menção
            const formasPagamento = `📱Formas de Pagamento Atualizadas📱 💳\n\n1. M-PESA 📱\n   - Número: 848619531\n   - DINIS MARTA\n\n2. E-MOLA 💸\n   - Número: 872960710\n   - MANUEL ZOCA\n\n3. BIM 🏦\n   - Conta nº: 1059773792\n   - CHONGO MANUEL\n\nApós efetuar o pagamento, por favor, envie o comprovante da transferência juntamente com seu contato.`;
            await enviar({ text: formasPagamento }, false);
            await sleep(4000);

            // ÚLTIMA MENSAGEM: com menção a todos
            const mensagemFinal = `✅ Estamos disponíveis para oferecer-te os melhores serviços ao seu dispor. Conta conosco sempre que precisar! 🙌\n🌐 Acesse nosso site oficial: https://topai-net-gigas.netlify.app/`;
            await enviar({ text: mensagemFinal }, true); // ✅ AQUI sim, menciona todos

            return;
        }

        // Se não for comando, envia tabela de preços (opcional)
        if (isGroup) {
            await enviar({ text: '📢 ATENÇÃO, MEMBROS DO GRUPO!' }, false);
            await sleep(4000);

            const tabelaPrecos = getTabelaPrecos();
            const partes = [];
            for (let i = 0; i < tabelaPrecos.length; i += 1000) {
                partes.push(tabelaPrecos.substring(i, i + 1000));
            }

            for (const parte of partes) {
                await enviar({ text: parte }, false);
                await sleep(1000);
            }

            console.log(`✅ Tabela de preços enviada em ${partes.length} parte(s).`);
        }

    } catch (error) {
        console.error('🚨 Erro ao processar comando:', error);
        if (from) {
            await sock.sendMessage(from, {
                text: '❌ Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
            }).catch(console.error);
        }
    }
};

module.exports = { handleTabela };

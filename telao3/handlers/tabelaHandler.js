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
        return; // Não é comando, ignora
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

        // Comando .s — Apenas Tabela, Ilimitado, Netflix e Formas de pagamento
        if (comando === '.s') {
            // 📊 Tabela
            const tabelaBuffer = fs.readFileSync(imagePath('tabela.jpg'));
            await enviar({
                image: tabelaBuffer,
                caption: '📊 Tabela Completa de Preços Atualizada!'
            });
            await sleep(4000);

            // 🎬 Netflix
            const netflixBuffer = fs.readFileSync(imagePath('Netflix.jpeg'));
            await enviar({
                image: netflixBuffer,
                caption: '🎬 Promoção Netflix Ativada!'
            });
            await sleep(4000);

            // 📞 Ilimitado
            const ilimitadoBuffer = fs.readFileSync(imagePath('ilimitado.png'));
            const legendaIlimitado = `📞 TUDO TOP VODACOM\n📍Chamadas e SMS ilimitadas para Todas Redes\n\n📆30 dias Tudo top\n\n450MT 🔥☎ Chamadas + SMS ilimitadas + 11GB +10min Int+30MB Roam\n550MT 🔥☎ Chamadas + SMS ilimitadas + 16GB +10min Int+30MB Roam\n650MT 🔥☎ Chamadas + SMS ilimitadas + 21GB +10min Int+30MB Roam\n850MT 🔥☎ Chamadas + SMS ilimitadas + 31GB +10min Int+30MB Roam\n1080MT 🔥☎ Chamadas + SMS ilimitadas + 41GB +10min Int+30MB Roam\n1300MT 🔥☎ Chamadas + SMS ilimitadas + 51GB +10min Int+30MB Roam\n\n> TOPAINETGIGAS 🛜✅`;
            await enviar({
                image: ilimitadoBuffer,
                caption: legendaIlimitado
            });
            await sleep(4000);

            // 💳 Formas de pagamento
            const formasPagamento = `📱Formas de Pagamento Atualizadas📱 💳\n\n1. M-PESA 📱\n   - Número: 848619531\n   - DINIS MARTA\n\n2. E-MOLA 💸\n   - Número: 872960710\n   - MANUEL ZOCA\n\n3. BIM 🏦\n   - Conta nº: 1059773792\n   - CHONGO MANUEL\n\nApós efetuar o pagamento, por favor, envie o comprovante da transferência juntamente com seu contato.`;
            await enviar({ text: formasPagamento }, false);

            return;
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

const fs = require('fs');
const path = require('path');

const getTabelaPrecos = () => {
    return `> ⓘ *❗️🔝MEGABYTE* *VODACOM* ...`.trim(); // pode manter igual
};

const handleTabela = async (sock, msg) => {
    const from = msg.key.remoteJid;
    const mensagem = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const comando = mensagem.trim().toLowerCase();

    try {
        console.log(`✅ Comando detectado no grupo ${from}`);

        const imagePath = (nomeArquivo) => path.join(__dirname, '..', 'fotos', nomeArquivo);
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const groupMetadata = await sock.groupMetadata(from).catch(() => null);
        const participants = groupMetadata ? groupMetadata.participants.map(p => p.id) : [];

        // Comando .n
        if (comando === '.n') {
            const imageBuffer = fs.readFileSync(imagePath('Netflix.jpeg'));
            await sock.sendMessage(from, {
                image: imageBuffer,
                caption: '🎬 Promoção Netflix Ativada!',
                mentions: participants
            });
            return;
        }

        // Comando .t
        if (comando === '.t') {
            const imageBuffer = fs.readFileSync(imagePath('tabela.jpg'));
            await sock.sendMessage(from, {
                image: imageBuffer,
                caption: '📊 Tabela Completa de Preços Atualizada!',
                mentions: participants
            });
            return;
        }

        // Comando .i
        if (comando === '.i') {
            const imageBuffer = fs.readFileSync(imagePath('ilimitado.png'));
            const legenda = `📞 TUDO TOP VODACOM\n📍Chamadas e SMS ilimitadas para Todas Redes\n\n📆30 dias Tudo top\n\n450MT 🔥☎ Chamadas + SMS ilimitadas + 11GB +10min Int+30MB Roam\n550MT 🔥☎ Chamadas + SMS ilimitadas + 16GB +10min Int+30MB Roam\n650MT 🔥☎ Chamadas + SMS ilimitadas + 21GB +10min Int+30MB Roam\n850MT 🔥☎ Chamadas + SMS ilimitadas + 31GB +10min Int+30MB Roam\n1080MT 🔥☎ Chamadas + SMS ilimitadas + 41GB +10min Int+30MB Roam\n1300MT 🔥☎ Chamadas + SMS ilimitadas + 51GB +10min Int+30MB Roam\n\n> TOPAINETGIGAS 🛜✅`;
            await sock.sendMessage(from, {
                image: imageBuffer,
                caption: legenda,
                mentions: participants
            });
            return;
        }

        // Comando .s
        if (comando === '.s') {
            const imagens = [
                { nome: 'tabela.jpg', legenda: '📊 Tabela Completa de Preços Atualizada! \n🌐 Acesse nosso site oficial: https://topai-net-gigas.netlify.app/' },
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
                { nome: 'menu.jpeg', legenda: '🛍️ *CATÁLOGO DE SERVIÇOS* \nExplore nosso portfólio de serviços: 📲CVs, 📰Panfletos, 🖼️Cartazes e muito mais!\n\n🌐 Acesse: https://topai-net-gigas.netlify.app/\n\nEstamos prontos para te atender com qualidade e agilidade! ✅' }
            ];

            for (const img of imagens) {
                const buffer = fs.readFileSync(imagePath(img.nome));
                await sock.sendMessage(from, {
                    image: buffer,
                    caption: img.legenda,
                    mentions: participants
                });
                await sleep(5000);
            }

            const formasPagamento = `📱Formas de Pagamento Atualizadas📱 💳\n\n1. M-PESA 📱\n   - Número: 848619531\n   - DINIS MARTA\n\n2. E-MOLA 💸\n   - Número: 872960710\n   - MANUEL ZOCA\n\n3. BIM 🏦\n   - Conta nº: 1059773792\n   - CHONGO MANUEL\n\nApós efetuar o pagamento, por favor, envie o comprovante da transferência juntamente com seu contato.`;
            await sock.sendMessage(from, { text: formasPagamento, mentions: participants });

            await sock.sendMessage(from, {
                text: '✅ Estamos disponíveis para oferecer-te os melhores serviços ao seu dispor. Conta conosco sempre que precisar! 🙌\n🌐 Acesse nosso site oficial: https://topai-net-gigas.netlify.app/',
                mentions: participants
            });
            return;
        }

        // Caso não seja comando, envia tabela texto
        if (!groupMetadata) {
            return sock.sendMessage(from, { text: '❌ Este comando só funciona em grupos!' });
        }

        await sock.sendMessage(from, {
            text: '📢 ATENÇÃO, MEMBROS DO GRUPO!',
            mentions: participants
        });

        await sleep(4000);

        const tabelaPrecos = getTabelaPrecos();
        const partes = [];
        for (let i = 0; i < tabelaPrecos.length; i += 1000) {
            partes.push(tabelaPrecos.substring(i, i + 1000));
        }

        for (const parte of partes) {
            await sock.sendMessage(from, { text: parte, mentions: participants });
            await sleep(1000);
        }

        console.log(`✅ Tabela de preços enviada em ${partes.length} parte(s).`);

    } catch (error) {
        console.error('🚨 Erro ao processar comando:', error);
        await sock.sendMessage(from, {
            text: '❌ Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
        });
    }
};

module.exports = { handleTabela };

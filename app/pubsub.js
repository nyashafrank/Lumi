const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-228bff6d-19e0-46b7-a217-97e89b427552',
    subscribeKey: 'sub-c-407bf818-0a11-11e9-8c56-3a98b9df8663',
    secretKey: 'sec-c-YjM5MjcyMWUtMDNiNy00ZGZmLWIzYjQtMTUzYjI1MmYxYzhk'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.pubnub = new PubNub(credentials);
        
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                console.log(`Message Received. Channel: ${channel}. Message: ${message}`);
                const parsedMessage = JSON.parse(message);

                switch(channel) {
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(parsedMessage, () => {
                            this.transactionPool.clearBlockchainTransactions({
                                chain: parsedMessage
                            });
                        });
                        break;
                    case CHANNELS.TRANSACTION:
                        this.transactionPool.setTransaction(parsedMessage);
                        break;
                    default: 
                        return;
                }
            }
        };
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }

}

module.exports = PubSub;
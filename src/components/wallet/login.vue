<template>
    <div class="connectWalletDia">
        <el-dialog
            title=""
            :visible.sync="dialogVisible"
            top="25vh"
            width="420px"
        >
            <div class="title">Select a wallet</div>
            <div class="walletContent">
                <div class="item" v-for="item,index in wallet" :key="index" @click="changeWallet(item.name)">
                    <div class="name">{{ item.title }}</div>
                    <div class="icon">
                        <img :src="item.icon" alt="">
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import metamaskIcon from '../../assets/metaMaskIcon.svg'
import walletconnectIcon from '../../assets/walletConnectIcon.svg'
import walletlinkIcon from '../../assets/coinbaseWalletIcon.svg'
import WalletConnectProvider from '@walletconnect/web3-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import Web3 from 'web3'
export default {
    name: '',
    data () {
        return {
            dialogVisible: false,
            wallet: [
                { name: 'metamask', icon: metamaskIcon, title: 'MetaMask' },
                { name: 'walletconnect', icon: walletconnectIcon, title: 'WalletConnect' },
                { name: 'walletlink', icon: walletlinkIcon, title: 'Coinbase Wallet' }
            ]
        }
    },
    methods: {
        async changeWallet(name) {
            let provider
            if (name === 'metamask') {
                const { ethereum } = window
                if (ethereum && ethereum.isMetaMask) {
                    provider = ethereum
                } else {
                    window.open('https://metamask.io/')
                }
            } else if (name === 'walletconnect') {
                provider = new WalletConnectProvider({
                    infuraId: '07cc32ed1e6ea3a7c35bc159d4251d62'
                })
            } else if (name === 'walletlink') {
                const walletLink = new CoinbaseWalletSDK({ appName: 'JLSwap', infuraId: '07cc32ed1e6ea3a7c35bc159d4251d62' })
                provider = walletLink.makeWeb3Provider('https://api.evm.eosnetwork.com', 17777)
            }
            if (provider) {
                try {
                    await provider.enable()
                    const web3 = new Web3(provider)
                    const address = await web3.eth.getAccounts()
                    const chainId = await web3.eth.getChainId()
                    console.log(address)
                    console.log(chainId)
                } catch {
                    console.log('err')
                }
            }
        }
    }
}
</script>
<style lang="less">
.connectWalletDia{
    .el-dialog__header{
        padding: 0;
    }
    .el-dialog{
        border-radius: 8px;
    }
    .el-dialog__body{
        padding:20px;
        .title{
            text-align: left;
            font-size: 16px;
            font-weight: bold;
            color: #000;
        }
        .walletContent{
            margin-top: 20px;
            .item{
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding:10px;
                cursor: pointer;
                background: #F5F8FC;
                margin-top: 10px;
                .name{
                    font-size: 16px;
                    font-weight: bold;
                    color: #000;
                }
                .icon{
                    width: 40px;
                    height: 40px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .item:hover{
                background: #DAE7F9;
            }
        }
    }
}
</style>

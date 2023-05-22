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
import { rpc, chainId } from '../../constants/common.js'
import { mapState, mapActions } from 'pinia'
import { baseInfoStore } from '../../store/index'
import Local from '../../utils/local'
import Web3 from 'web3'
export default {
    name: 'walletLogin',
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
    computed: {
        ...mapState(baseInfoStore, ['provider'])
    },
    methods: {
        ...mapActions(baseInfoStore, ['changeProvider', 'changeFromAddress', 'changeNetwork', 'connectWeb3', 'changeInit']),
        show() {
            this.dialogVisible = true
        },
        async autoConnect() {
            const name = Local.load('walletConnectName')
            let provider0
            if (name === 'metamask') {
                const { ethereum } = window
                if (ethereum && ethereum.isMetaMask) {
                    provider0 = window.ethereum
                } else {
                    window.open('https://metamask.io/')
                }
            } else if (name === 'walletconnect') {
                provider0 = new WalletConnectProvider({
                    rpc: {
                        17777: 'https://api.evm.eosnetwork.com'
                    },
                    infuraId: '07cc32ed1e6ea3a7c35bc159d4251d62'

                })
            } else if (name === 'walletlink') {
                const walletLink = new CoinbaseWalletSDK({ appName: 'JLSwap', infuraId: '07cc32ed1e6ea3a7c35bc159d4251d62' })
                provider0 = walletLink.makeWeb3Provider(rpc, chainId)
            }
            if (provider0) {
                try {
                    await provider0.enable()
                    const web3 = new Web3(provider0)
                    const address = await web3.eth.getAccounts()
                    const currentChainId = await web3.eth.getChainId()
                    if (address) {
                        await this.changeProvider(provider0)
                        this.onChangeAccount()
                        this.onChangeChain()
                        this.changeFromAddress(address[0])
                        if (currentChainId !== chainId) {
                            console.log('app network err')
                            this.changeNetwork(false)
                            this.dialogVisible = false
                        } else {
                            Local.put('walletConnectName', name)
                            this.changeNetwork(true)
                            this.dialogVisible = false
                        }
                    }
                } catch {
                    console.log('err')
                }
            }
        },
        async changeWallet(name) {
            let provider0
            if (name === 'metamask') {
                const { ethereum } = window
                if (ethereum && ethereum.isMetaMask) {
                    provider0 = window.ethereum
                } else {
                    window.open('https://metamask.io/')
                }
            } else if (name === 'walletconnect') {
                provider0 = new WalletConnectProvider({
                    rpc: {
                        17777: 'https://api.evm.eosnetwork.com'
                    },
                    infuraId: 'e38d305ad916e7786028bd8e8b2db1c2'

                })
            } else if (name === 'walletlink') {
                const walletLink = new CoinbaseWalletSDK({ appName: 'JLSwap', infuraId: 'e38d305ad916e7786028bd8e8b2db1c2' })
                provider0 = walletLink.makeWeb3Provider(rpc, chainId)
            }

            try {
                await provider0.enable()
                const web3 = new Web3(provider0)
                const address = await web3.eth.getAccounts()
                const currentChainId = await web3.eth.getChainId()
                if (address) {
                    await this.changeProvider(provider0)
                    this.onChangeAccount()
                    this.onChangeChain()
                    this.changeFromAddress(address[0])
                    if (currentChainId !== chainId) {
                        // await provider0.disconnect()
                        console.log('app network err')
                        this.changeNetwork(false)
                        this.dialogVisible = false
                    } else {
                        this.changeNetwork(true)
                        Local.put('walletConnectName', name)
                        this.dialogVisible = false
                    }
                }
            } catch {
                console.log('err')
            }
        },
        // 监听账户切换
        onChangeAccount() {
            if (this.provider) {
                const that = this
                this.provider.on('accountsChanged', function(res) {
                    console.log('用户改变')
                    that.changeFromAddress(res[0])
                })
            }
        },
        // 监听链是否正确
        onChangeChain() {
            if (this.provider) {
                const that = this
                this.provider.on('chainChanged', function(val) {
                    const chainId = Web3.utils.numberToHex(that.chainId)
                    if (val !== chainId) {
                        that.changeNetwork(false)
                    } else {
                        console.log('chain正确')
                        that.changeNetwork(true)
                    }
                })
            }
        }
    },
    created () {
        this.autoConnect()
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

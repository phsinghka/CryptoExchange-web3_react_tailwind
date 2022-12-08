import React, { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';

import { contractAddress, contractABI } from '../utils/constants';

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount')
  );
  const [transaction, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  });

  const handleChange = (e, name) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const getAllTransactions = async () => {
    if (!ethereum) return alert('Please Install Metamask');
    const transactionContract = getEthereumContract();
    const availableTransaction = await transactionContract.getAllTransactions();

    const structuredTransaction = availableTransaction.map((transaction) => ({
      addressTo: transaction.receiver,
      addressFrom: transaction.sender,
      timestamp: new Date(
        transaction.timestamp.toNumber() * 1000
      ).toLocaleString(),
      message: transaction.message,
      keyword: transaction.keyword,
      amount: parseInt(transaction.amount._hex) / 10 ** 18,
    }));

    setTransactions(structuredTransaction);
    console.log(availableTransaction);
  };

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) return alert('Please Install Metamask');

    const account = await ethereum.request({ method: 'eth_accounts' });
    getAllTransactions();

    if (account.length) {
      setCurrentAccount(account[0]);
    }
  };

  const checkIfTransactionExists = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem('transactionCount', transactionCount);
    } catch (error) {}
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please Install Metamask');

      const account = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setCurrentAccount(account[0]);
    } catch (error) {
      console.log(error);
      throw new Error('No EThereum Object');
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert('Please Install Metamask');
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      console.log(transactionContract);
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: '0x5208',
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        keyword,
        message
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());
    } catch (error) {}
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionExists();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        sendTransaction,
        handleChange,
        isLoading,
        transaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

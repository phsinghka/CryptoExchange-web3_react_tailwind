require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/L7ClnsIQZwJBLImPpxMjPZE7kkqqEHfq',
      accounts: [
        '45fc8f891fa9a4a1353609d67e98ba2bb0ac80f235d3a9ecb8e4609109caeeb2',
      ],
    },
  },
};

//https://eth-goerli.g.alchemy.com/v2/L7ClnsIQZwJBLImPpxMjPZE7kkqqEHfq

// Address - 0xBadDd3456C262cbdA7273AD035A64941B7B83683

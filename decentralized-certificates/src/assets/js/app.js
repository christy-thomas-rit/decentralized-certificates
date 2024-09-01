const App = {
    web3: null,
    account: null,
    certificateRegistry: null,

    start: async function() {
        const { web3 } = this;

        try {
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = CertificateRegistry.networks[networkId];
            this.certificateRegistry = new web3.eth.Contract(
                CertificateRegistry.abi,
                deployedNetwork && deployedNetwork.address,
            );
        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },

    registerInstitution: async function() {
        const name = document.getElementById('name').value;
        const location = document.getElementById('location').value;

        await this.certificateRegistry.methods.registerInstitution(name, location).send({ from: this.account });
        alert("Institution registered successfully!");
    },

    issueCertificate: async function() {
        const studentAddress = document.getElementById('studentAddress').value;
        const courseName = document.getElementById('courseName').value;
        const ipfsHash = document.getElementById('ipfsHash').value;

        await this.certificateRegistry.methods.issueCertificate(studentAddress, courseName, ipfsHash).send({ from: this.account });
        alert("Certificate issued successfully!");
        this.loadCertificates();
    },

    loadCertificates: async function() {
        const certificatesDiv = document.getElementById('certificates');
        certificatesDiv.innerHTML = '';

        const certificates = await this.certificateRegistry.methods.getCertificates(this.account).call();
        certificates.forEach(certificate => {
            const certElement = document.createElement('div');
            certElement.innerHTML = `<p>${certificate.studentName} - ${certificate.courseName} - <a href="https://ipfs.io/ipfs/${certificate.ipfsHash}" target="_blank">Download Certificate</a></p>`;
            certificatesDiv.appendChild(certElement);
        });
    }
};

window.App = App;

window.addEventListener("load", function() {
    if (window.ethereum) {
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    } else {
        console.warn("No web3 detected. Falling back to http://127.0.0.1:8545.");
        App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }

    App.start();
});

// test/Certificate.test.js
const CertificateRegistry = artifacts.require("CertificateRegistry");

contract("CertificateRegistry", accounts => {
    const institutionAccount = accounts[0];
    const studentAccount = accounts[1];
    const studentName = "John Doe";
    const courseName = "Blockchain 101";
    const ipfsHash = "Qm..."; // Example IPFS hash

    it("should register an institution", async () => {
        const instance = await CertificateRegistry.deployed();
        await instance.registerInstitution("Test University", "Location", { from: institutionAccount });

        const institution = await instance.institutions(institutionAccount);
        assert.equal(institution.name, "Test University", "Institution name does not match");
    });

    it("should register a student", async () => {
        const instance = await CertificateRegistry.deployed();
        await instance.registerStudent(studentName, institutionAccount, { from: studentAccount });

        const student = await instance.students(studentAccount);
        assert.equal(student.name, studentName, "Student name does not match");
    });

    it("should issue a certificate", async () => {
        const instance = await CertificateRegistry.deployed();
        await instance.issueCertificate(studentAccount, courseName, ipfsHash, { from: institutionAccount });

        const certificates = await instance.getCertificates(studentAccount);
        assert.equal(certificates[0].courseName, courseName, "Course name does not match");
        assert.equal(certificates[0].ipfsHash, ipfsHash, "IPFS hash does not match");
    });
});

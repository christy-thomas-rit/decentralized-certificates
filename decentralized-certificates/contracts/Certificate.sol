// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Institution {
        string name;
        string location;
        address institutionAddress;
        bool exists;
    }

    struct Student {
        string name;
        address studentAddress;
        address institutionAddress;
        bool exists;
    }

    struct Certificate {
        string studentName;
        string courseName;
        string ipfsHash;
    }

    mapping(address => Institution) public institutions;
    mapping(address => Student) public students;
    mapping(address => Certificate[]) public certificates;

    event InstitutionRegistered(address institutionAddress, string name);
    event StudentRegistered(address studentAddress, string name);
    event CertificateIssued(address institutionAddress, string studentName, string ipfsHash);

    function registerInstitution(string memory _name, string memory _location) public {
        require(!institutions[msg.sender].exists, "Institution already registered.");
        institutions[msg.sender] = Institution(_name, _location, msg.sender, true);
        emit InstitutionRegistered(msg.sender, _name);
    }

    function registerStudent(string memory _name, address _institutionAddress) public {
        require(!students[msg.sender].exists, "Student already registered.");
        require(institutions[_institutionAddress].exists, "Institution does not exist.");
        students[msg.sender] = Student(_name, msg.sender, _institutionAddress, true);
        emit StudentRegistered(msg.sender, _name);
    }

    function issueCertificate(address _studentAddress, string memory _courseName, string memory _ipfsHash) public {
        require(institutions[msg.sender].exists, "Only registered institutions can issue certificates.");
        require(students[_studentAddress].exists, "Student not registered.");
        require(students[_studentAddress].institutionAddress == msg.sender, "Student not registered under this institution.");

        certificates[_studentAddress].push(Certificate(students[_studentAddress].name, _courseName, _ipfsHash));
        emit CertificateIssued(msg.sender, students[_studentAddress].name, _ipfsHash);
    }

    function getCertificates(address _studentAddress) public view returns (Certificate[] memory) {
        return certificates[_studentAddress];
    }
}

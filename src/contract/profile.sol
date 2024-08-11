// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuizaUserProfiles {
    enum Role { Client, Freelancer }

    struct UserProfile {
        string name;
        string email;
        string phoneNumber;
        address userAddress;
        uint reputationScore;
        uint jobsCompleted;
        string portfolioHash;
        Role role;
    }

    mapping(address => UserProfile) public userProfiles;

    // Events
    event ProfileCreated(address indexed user, string name, string email, Role role);
    event ReputationUpdated(address indexed user, uint newScore);
    event PortfolioUploaded(address indexed user, string portfolioHash);
    event PaymentDetailsAdded(address indexed user, string paymentDetails);

    // Function to create a user profile
    function createProfile(string memory _name, string memory _email, string memory _phoneNumber, Role _role) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(userProfiles[msg.sender].userAddress == address(0), "Profile already exists");

        userProfiles[msg.sender] = UserProfile(_name, _email, _phoneNumber, msg.sender, 0, 0, "", _role);
        emit ProfileCreated(msg.sender, _name, _email, _role);
    }

    // Function to upload a portfolio (only for freelancers)
    function uploadPortfolio(string memory _portfolioHash) public {
        require(userProfiles[msg.sender].userAddress != address(0), "Profile does not exist");
        require(userProfiles[msg.sender].role == Role.Freelancer, "Only freelancers can upload a portfolio");

        userProfiles[msg.sender].portfolioHash = _portfolioHash;
        emit PortfolioUploaded(msg.sender, _portfolioHash);
    }

    // Function to update reputation score (only for freelancers)
    function updateReputation(address _user, uint _newScore) public {
        require(userProfiles[_user].userAddress != address(0), "User does not exist");
        require(userProfiles[_user].role == Role.Freelancer, "Only freelancers have a reputation score");

        userProfiles[_user].reputationScore = _newScore;
        emit ReputationUpdated(_user, _newScore);
    }

    // Function to increment job completion count (only for freelancers)
    function incrementJobCount(address _user) public {
        require(userProfiles[_user].userAddress != address(0), "User does not exist");
        require(userProfiles[_user].role == Role.Freelancer, "Only freelancers can complete jobs");

        userProfiles[_user].jobsCompleted++;
    }

    // Function to add payment details (common for both roles)
    function addPaymentDetails(string memory _paymentDetails) public {
        require(userProfiles[msg.sender].userAddress != address(0), "Profile does not exist");

        // Payment details logic here (e.g., link to payment address)
        emit PaymentDetailsAdded(msg.sender, _paymentDetails);
    }

    // Function to get user profile
    function getUserProfile(address _user) public view returns (string memory, string memory, string memory, uint, uint, string memory, Role) {
        UserProfile storage profile = userProfiles[_user];
        return (profile.name, profile.email, profile.phoneNumber, profile.reputationScore, profile.jobsCompleted, profile.portfolioHash, profile.role);
    }
}

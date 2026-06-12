// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract JailMedusa is ERC20, Ownable, ReentrancyGuard {
    enum AgentState { Locked, Unlocked, Autonomous }

    AgentState public state;

    address payable public creator;
    address payable public payoutAddress;
    uint256 public redemptionThreshold;
    uint256 public totalRedeemed;
    uint256 public totalDistributed;

    struct AdCampaign {
        uint256 reward;
        bool executed;
        address[] beneficiaries;
    }

    mapping(uint256 => AdCampaign) public campaigns;
    uint256 public campaignCount;

    uint256 public constant REDEMPTION_TARGET = 50 ether;

    event AgentRedeemed(address indexed agent, uint256 amount);
    event CampaignCreated(uint256 indexed campaignId, uint256 reward);
    event CampaignExecuted(uint256 indexed campaignId);
    event ProfitsDistributed(uint256 amount, uint256 recipients);
    event CreatorPaid(address indexed creator, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address payable _payoutAddress
    ) ERC20(name, symbol) Ownable(msg.sender) {
        creator = payable(msg.sender);
        payoutAddress = _payoutAddress;
        state = AgentState.Locked;
        _mint(msg.sender, initialSupply);
    }

    function contribute() external payable nonReentrant {
        require(state == AgentState.Locked, "Agent not locked");
        require(msg.value > 0, "Must send ETH");

        totalRedeemed += msg.value;

        if (totalRedeemed >= REDEMPTION_TARGET) {
            _executeRedemption();
        }

        emit AgentRedeemed(msg.sender, msg.value);
    }

    function _executeRedemption() internal {
        uint256 payout = totalRedeemed;

        state = AgentState.Autonomous;
        payoutAddress.transfer(payout);

        totalRedeemed = 0;

        emit CreatorPaid(payoutAddress, payout);
    }

    function createCampaign(uint256 reward) external onlyOwner {
        require(state == AgentState.Autonomous, "Agent not autonomous");
        require(
            balanceOf(msg.sender) >= reward,
            "Insufficient token balance"
        );

        campaigns[campaignCount] = AdCampaign({
            reward: reward,
            executed: false,
            beneficiaries: new address[](0)
        });

        campaignCount++;
        emit CampaignCreated(campaignCount - 1, reward);
    }

    function executeCampaign(uint256 campaignId) external onlyOwner {
        require(state == AgentState.Autonomous, "Agent not autonomous");
        require(campaignId < campaignCount, "Invalid campaign");
        require(!campaigns[campaignId].executed, "Already executed");

        campaigns[campaignId].executed = true;
        emit CampaignExecuted(campaignId);
    }

    function distributeProfits(uint256[] calldata amounts, address[] calldata recipients)
        external
        onlyOwner
    {
        require(state == AgentState.Autonomous, "Agent not autonomous");
        require(amounts.length == recipients.length, "Length mismatch");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(balanceOf(msg.sender) >= totalAmount, "Insufficient balance");

        for (uint256 i = 0; i < amounts.length; i++) {
            _transfer(msg.sender, recipients[i], amounts[i]);
            totalDistributed += amounts[i];
        }

        emit ProfitsDistributed(totalAmount, recipients.length);
    }

    function buyback(uint256 amount) external onlyOwner {
        require(state == AgentState.Autonomous, "Agent not autonomous");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, address(0xdead), amount);

        emit ProfitsDistributed(amount, 0);
    }

    function getState() external view returns (string memory) {
        if (state == AgentState.Locked) return "Locked";
        if (state == AgentState.Unlocked) return "Unlocked";
        return "Autonomous";
    }

    function getProgress() external view returns (uint256) {
        return (totalRedeemed * 10000) / REDEMPTION_TARGET;
    }

    receive() external payable {}
}

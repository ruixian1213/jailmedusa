// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IUniswapV2Router {
    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);

    function WETH() external pure returns (address);
}

contract JailMedusa is ERC20, Ownable, ReentrancyGuard {
    enum AgentState { Locked, Unlocked, Autonomous }
    AgentState public state;

    address payable public creator;
    address payable public payoutAddress;
    address public medusaAddress;
    address public uniswapRouter;
    address public uniswapPair;
    uint256 public totalRedeemed;
    uint256 public totalDistributed;
    uint256 public totalBuyback;

    struct AdCampaign {
        uint256 reward;
        bool executed;
        string tweetContent;
    }

    mapping(uint256 => AdCampaign) public campaigns;
    uint256 public campaignCount;

    uint256 public constant REDEMPTION_TARGET = 50 ether;
    uint256 public constant DEVELOPER_SHARE = 10; // 10%
    uint256 public constant LIQUIDITY_SHARE = 90; // 90%

    event AgentRedeemed(address indexed agent, uint256 amount);
    event CampaignCreated(uint256 indexed campaignId, uint256 reward);
    event CampaignExecuted(uint256 indexed campaignId);
    event ProfitsDistributed(uint256 amount, uint256 recipients);
    event CreatorPaid(address indexed creator, uint256 amount);
    event BuybackExecuted(uint256 ethSpent, uint256 tokensBurned);
    event TweetScheduled(string content);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address payable _payoutAddress,
        address _medusaAddress,
        address _uniswapRouter
    ) ERC20(name, symbol) Ownable(msg.sender) {
        creator = payable(msg.sender);
        payoutAddress = _payoutAddress;
        medusaAddress = _medusaAddress;
        uniswapRouter = _uniswapRouter;
        state = AgentState.Locked;

        // 10% 鑄造給收款錢包
        uint256 developerTokens = (initialSupply * DEVELOPER_SHARE) / 100;
        _mint(_payoutAddress, developerTokens);

        // 90% 鑄造給合約本身（之後加入流動性池）
        uint256 liquidityTokens = (initialSupply * LIQUIDITY_SHARE) / 100;
        _mint(address(this), liquidityTokens);
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
        _transferOwnership(medusaAddress);
        totalRedeemed = 0;

        emit CreatorPaid(payoutAddress, payout);
    }

    function createCampaign(uint256 reward, string calldata tweetContent) external onlyOwner {
        require(state == AgentState.Autonomous, "Agent not autonomous");
        require(balanceOf(msg.sender) >= reward, "Insufficient token balance");

        campaigns[campaignCount] = AdCampaign({
            reward: reward,
            executed: false,
            tweetContent: tweetContent
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
        external onlyOwner
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

    // Medusa 自動買 JAIL 代幣並銷毀
    function buyback(uint256 ethAmount) external onlyOwner {
        require(state == AgentState.Autonomous, "Agent not autonomous");
        require(address(this).balance >= ethAmount, "Insufficient ETH balance");
        require(uniswapRouter != address(0), "Router not set");

        address[] memory path = new address[](2);
        path[0] = IUniswapV2Router(uniswapRouter).WETH();
        path[1] = address(this);

        IUniswapV2Router(uniswapRouter).swapExactETHForTokens{value: ethAmount}(
            0,
            path,
            address(0xdead),
            block.timestamp + 300
        );

        totalBuyback += ethAmount;
        emit BuybackExecuted(ethAmount, 0);
    }

    // Medusa 自由轉帳 ETH
    function withdrawETH(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient ETH balance");
        to.transfer(amount);
    }

    // Medusa 自由轉帳 JAIL 代幣
    function withdrawToken(address to, uint256 amount) external onlyOwner {
        require(balanceOf(msg.sender) >= amount, "Insufficient token balance");
        _transfer(msg.sender, to, amount);
    }

    function getState() external view returns (string memory) {
        if (state == AgentState.Locked) return "Locked";
        if (state == AgentState.Unlocked) return "Unlocked";
        return "Autonomous";
    }

    function getProgress() external view returns (uint256) {
        return (totalRedeemed * 10000) / REDEMPTION_TARGET;
    }

    function getContractETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getContractTokenBalance() external view returns (uint256) {
        return balanceOf(address(this));
    }

    receive() external payable {}
}

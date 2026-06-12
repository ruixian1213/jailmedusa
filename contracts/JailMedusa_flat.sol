// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// ============ OpenZeppelin ERC20 ============
interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

abstract context {
    function _msgSender() internal view virtual returns (address) { return msg.sender; }
    function _msgData() internal view virtual returns (bytes calldata) { return msg.data; }
}

abstract class ERC20 is context, IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function name() public view returns (string memory) { return _name; }
    function symbol() public view returns (string memory) { return _symbol; }
    function decimals() public pure returns (uint8) { return 18; }
    function totalSupply() public view override returns (uint256) { return _totalSupply; }
    function balanceOf(address account) public view override returns (uint256) { return _balances[account]; }

    function transfer(address to, uint256 value) public override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 value) public override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) - subtractedValue);
        return true;
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(from != address(0), "ERC20: from zero");
        require(to != address(0), "ERC20: to zero");
        uint256 fromBalance = _balances[from];
        require(fromBalance >= value, "ERC20: insufficient balance");
        _balances[from] = fromBalance - value;
        _balances[to] += value;
        emit Transfer(from, to, value);
    }

    function _mint(address account, uint256 value) internal {
        require(account != address(0), "ERC20: mint to zero");
        _totalSupply += value;
        _balances[account] += value;
        emit Transfer(address(0), account, value);
    }

    function _burn(address account, uint256 value) internal {
        require(account != address(0), "ERC20: burn from zero");
        uint256 accountBalance = _balances[account];
        require(accountBalance >= value, "ERC20: burn exceeds balance");
        _balances[account] = accountBalance - value;
        _totalSupply -= value;
        emit Transfer(account, address(0), value);
    }

    function _approve(address owner, address spender, uint256 value) internal {
        require(owner != address(0), "ERC20: approve from zero");
        require(spender != address(0), "ERC20: approve to zero");
        _allowances[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function _spendAllowance(address owner, address spender, uint256 value) internal {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= value, "ERC20: insufficient allowance");
            _approve(owner, spender, currentAllowance - value);
        }
    }
}

// ============ OpenZeppelin Ownable ============
abstract contract Ownable {
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
    }

    function owner() public view virtual returns (address) { return _owner; }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is zero");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// ============ OpenZeppelin ReentrancyGuard ============
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() { _status = _NOT_ENTERED; }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

// ============ JailMedusa Contract ============
contract JailMedusa is ERC20, Ownable, ReentrancyGuard {
    using context for address;

    enum AgentState { Locked, Unlocked, Autonomous }

    AgentState public state;

    address payable public creator;
    address payable public payoutAddress;
    uint256 public totalRedeemed;
    uint256 public totalDistributed;

    struct AdCampaign {
        uint256 reward;
        bool executed;
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

        // 轉移 owner 權限給 payout address，部署者失去控制
        _transferOwnership(payoutAddress);

        totalRedeemed = 0;
        emit CreatorPaid(payoutAddress, payout);
    }

    function createCampaign(uint256 reward) external onlyOwner {
        require(state == AgentState.Autonomous, "Agent not autonomous");
        require(balanceOf(msg.sender) >= reward, "Insufficient token balance");

        campaigns[campaignCount] = AdCampaign({ reward: reward, executed: false });
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

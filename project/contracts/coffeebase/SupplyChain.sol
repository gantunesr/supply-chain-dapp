pragma solidity ^0.4.24;

import "./../coffeecore/Ownable.sol";
import "./../coffeeaccesscontrol/FarmerRole.sol";
import "./../coffeeaccesscontrol/DistributorRole.sol";
import "./../coffeeaccesscontrol/RetailerRole.sol";
import "./../coffeeaccesscontrol/ConsumerRole.sol";


contract SupplyChain is Ownable, FarmerRole, DistributorRole, RetailerRole, ConsumerRole {

  address _owner;
  uint  upc;
  uint  sku;

  mapping (uint => Item) items;

  mapping (uint => string[]) itemsHistory;
  
  enum State 
  { 
    Harvested,
    Processed,
    Packed,
    ForSale,
    Sold,
    Shipped,
    Received,
    Purchased
    }

  State constant defaultState = State.Harvested;

  struct Item {
    uint    sku;
    uint    upc;
    address ownerID;
    address originFarmerID;
    string  originFarmName;
    string  originFarmInformation;
    string  originFarmLatitude;
    string  originFarmLongitude;
    uint    productID;
    string  productNotes;
    uint    productPrice;
    State   itemState;
    address distributorID;
    address retailerID;
    address consumerID;
  }

  event Harvested(uint upc);
  event Processed(uint upc);
  event Packed(uint upc);
  event ForSale(uint upc);
  event Sold(uint upc);
  event Shipped(uint upc);
  event Received(uint upc);
  event Purchased(uint upc);

  modifier onlyOwner() {
    require(msg.sender == _owner);
    _;
  }

  modifier verifyCaller (address _address) {
    require(msg.sender == _address); 
    _;
  }

  modifier paidEnough(uint _price) { 
    require(msg.value >= _price); 
    _;
  }
  
  modifier checkValue(uint _upc) {
    _;
    uint _price = items[_upc].productPrice;
    uint amountToReturn = msg.value - _price;
    items[_upc].consumerID.transfer(amountToReturn);
  }

  modifier harvested(uint _upc) {
    require(items[_upc].itemState == State.Harvested);
    _;
  }

  modifier processed(uint _upc) {
    require(items[_upc].itemState == State.Processed);
    _;
  }
  
  modifier packed(uint _upc) {
    require(items[_upc].itemState == State.Packed);
    _;
  }

  modifier forSale(uint _upc) {
    require(items[_upc].itemState == State.ForSale);
    _;
  }

  modifier sold(uint _upc) {
    require(items[_upc].itemState == State.Sold);
    _;
  }
  
  modifier shipped(uint _upc) {
    require(items[_upc].itemState == State.Shipped);
    _;
  }

  modifier received(uint _upc) {
    require(items[_upc].itemState == State.Received);
    _;
  }

  modifier purchased(uint _upc) {
    require(items[_upc].itemState == State.Purchased);
    _;
  }

  constructor() public payable {
    _owner = msg.sender;
    sku = 1;
    upc = 1;
  }

  function kill() public {
    if (msg.sender == _owner) {
      selfdestruct(_owner);
    }
  }

  function harvestItem(uint _upc, address _originFarmerID, string memory _originFarmName, string memory _originFarmInformation, string memory _originFarmLatitude, string memory _originFarmLongitude, string memory _productNotes) public 
  verifyCaller(_originFarmerID)
  onlyFarmer
  {
    items[sku] = Item({
      sku: sku,
      upc: _upc,
      ownerID: msg.sender,
      originFarmerID: _originFarmerID,
      originFarmName: _originFarmName,
      originFarmInformation: _originFarmInformation,
      originFarmLatitude: _originFarmLatitude,
      originFarmLongitude: _originFarmLongitude, 
      productID: sku + _upc,
      productNotes: _productNotes,
      productPrice: 0,
      itemState: State.Harvested,
      distributorID: address(0),
      retailerID: address(0),
      consumerID: address(0)
    });
    
    sku = sku + 1;
    emit Harvested(_upc);
  }

  function processItem(uint _upc) public 
  harvested(_upc)
  onlyFarmer
  {
    items[_upc].itemState = State.Processed;    
    emit Processed(_upc);    
  }

  function packItem(uint _upc) public 
  processed(_upc)
  onlyFarmer
  {
    items[_upc].itemState = State.Packed;    
    emit Packed(_upc);
    
  }

  function sellItem(uint _upc, uint _price) public 
  packed(_upc)
  onlyFarmer
  {
    items[_upc].itemState = State.ForSale;
    items[_upc].productPrice = _price;    
    emit ForSale(_upc);
  }

  function buyItem(uint _upc) public payable 
  forSale(_upc)
  paidEnough(items[_upc].productPrice)
  checkValue(_upc)
  onlyDistributor
    {
    
    items[_upc].itemState = State.Sold;
    items[_upc].ownerID = msg.sender;
    items[_upc].distributorID = msg.sender;

    address farmerAddress = items[_upc].originFarmerID;
    uint productPrice = items[_upc].productPrice;
    farmerAddress.transfer(productPrice);

    emit Sold(_upc);
  }

  function shipItem(uint _upc) public 
    sold(_upc)
    onlyDistributor   
    {

    items[_upc].itemState = State.Shipped;
    emit Shipped(_upc);
    
  }

  function receiveItem(uint _upc) public 
    shipped(_upc)
    onlyRetailer
    {

    items[_upc].itemState = State.Received;
    items[_upc].ownerID = msg.sender;
    items[_upc].retailerID = msg.sender;
    
    emit Received(_upc);
    
  }

  function purchaseItem(uint _upc) public
    received(_upc)
    onlyConsumer
    {
    items[_upc].itemState = State.Purchased;
    items[_upc].ownerID = msg.sender;
    items[_upc].consumerID = msg.sender;
    
    emit Purchased(_upc);
    
  }

  function fetchItemBufferOne(uint _upc) public view returns (
    uint    itemSKU,
    uint    itemUPC,
    address ownerID,
    address originFarmerID,
    string memory originFarmName,
    string memory originFarmInformation,
    string memory originFarmLatitude,
    string memory originFarmLongitude) 
  {

  itemSKU = items[_upc].sku;
  itemUPC = items[_upc].upc;
  ownerID = items[_upc].ownerID;
  originFarmerID = items[_upc].originFarmerID;
  originFarmName = items[_upc].originFarmName;
  originFarmInformation = items[_upc].originFarmInformation;
  originFarmLatitude = items[_upc].originFarmLatitude;
  originFarmLongitude = items[_upc].originFarmLongitude;
  
  return (
    itemSKU,
    itemUPC,
    ownerID,
    originFarmerID,
    originFarmName,
    originFarmInformation,
    originFarmLatitude,
    originFarmLongitude);
  }

  function fetchItemBufferTwo(uint _upc) public view returns (
    uint            itemSKU,
    uint            itemUPC,
    uint            productID,
    string memory   productNotes,
    uint            productPrice,
    uint            itemState,
    address         distributorID,
    address         retailerID,
    address         consumerID) 
  {
    
  itemSKU = items[_upc].sku;
  itemUPC = items[_upc].upc;
  productID = items[_upc].productID;
  productNotes = items[_upc].productNotes;
  productPrice = items[_upc].productPrice;
  itemState = uint(items[_upc].itemState);
  distributorID = items[_upc].distributorID;
  retailerID = items[_upc].retailerID;
  consumerID = items[_upc].consumerID; 
  
    
  return (
    itemSKU,
    itemUPC,
    productID,
    productNotes,
    productPrice,
    itemState,
    distributorID,
    retailerID,
    consumerID);
  }
}

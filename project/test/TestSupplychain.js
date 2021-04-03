var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = 'John Doe'
    const originFarmInformation = 'Yarray Valley'
    const originFarmLatitude = '-38.239770'
    const originFarmLongitude = '144.341490'
    var productID = sku + upc
    const productNotes = 'Best beans for Espresso'
    const productPrice = web3.toWei('1', 'ether')
    // var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    // const emptyAddress = '0x00000000000000000000000000000000000000'

    console.log('ganache-cli accounts used here...')
    console.log('Contract Owner: accounts[0] ', accounts[0])
    console.log('Farmer: accounts[1] ', accounts[1])
    console.log('Distributor: accounts[2] ', accounts[2])
    console.log('Retailer: accounts[3] ', accounts[3])
    console.log('Consumer: accounts[4] ', accounts[4])

    it('Testing smart contract add accounts to the supply chain', async() => {
        const supplyChain = await SupplyChain.deployed()

        await supplyChain.addFarmer(originFarmerID, { 'from': ownerID })
        const resIsFarmer = await supplyChain.isFarmer(originFarmerID)

        await supplyChain.addDistributor(distributorID, { 'from': ownerID })
        const resIsDistributor = await supplyChain.isDistributor(distributorID)

        await supplyChain.addRetailer(retailerID, { 'from': ownerID })
        const resIsRetailer = await supplyChain.isRetailer(retailerID)

        await supplyChain.addConsumer(consumerID, { 'from': ownerID })
        const resIsConsumer = await supplyChain.isConsumer(consumerID)
        
        assert.equal(true, resIsFarmer, 'Error: Farmer not added')
        assert.equal(true, resIsDistributor, 'Error: Distributor not added')
        assert.equal(true, resIsRetailer, 'Error: Retailer not added')
        assert.equal(true, resIsConsumer, 'Error: Consumer not added')
        
    })

    it('Testing smart contract function harvestItem() that allows a farmer to harvest coffee', async() => {
        const supplyChain = await SupplyChain.deployed()
                
        let res = await supplyChain.harvestItem(
            upc,
            originFarmerID,
            originFarmName,
            originFarmInformation,
            originFarmLatitude,
            originFarmLongitude,
            productNotes,
            { 'from': originFarmerID }
        )

        supplyChain.fetchItemBufferOne
                   .call(upc)
                   .then(resultBufferOne => {
                        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
                        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
                        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
                        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
                        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
                        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
                        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
                        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
                        assert.equal(res.logs[0].event, 'Harvested', 'Error: Invalid item State')
                    });
    })    

    it('Testing smart contract function processItem() that allows a farmer to process coffee', async() => {
        const supplyChain = await SupplyChain.deployed()
        
        const res = await supplyChain.processItem(upc, { 'from': originFarmerID });

        supplyChain.fetchItemBufferOne
                   .call(upc)
                   .then(resultBufferOne => {
                        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
                        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
                        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
                        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
                        assert.equal(res.logs[0].event, 'Processed', 'Error: Invalid item State')
                    });
    })    

    it('Testing smart contract function packItem() that allows a farmer to pack coffee', async() => {
        const supplyChain = await SupplyChain.deployed()
        
        const res = await supplyChain.packItem(upc, { 'from': originFarmerID });

        supplyChain.fetchItemBufferOne
                   .call(upc)
                   .then(resultBufferOne => {
                        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
                        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
                        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
                        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
                        assert.equal(res.logs[0].event, 'Packed', 'Error: Invalid item State')
                    });
    })    

    it('Testing smart contract function sellItem() that allows a farmer to sell coffee', async() => {
        const supplyChain = await SupplyChain.deployed()
        
        const res = await supplyChain.sellItem(upc, productPrice, { 'from': originFarmerID });
        const itemBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const itemBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        assert.equal(itemBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(itemBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(itemBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(itemBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(res.logs[0].event, 'ForSale', 'Error: Invalid event')

        assert.equal(itemBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
    })    

    it('Testing smart contract function buyItem() that allows a distributor to buy coffee', async() => {
        const supplyChain = await SupplyChain.deployed();
 
        const res = await supplyChain.buyItem(upc, { "from": distributorID, "value": productPrice });

        const itemBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const itemBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        assert.equal(itemBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(itemBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(itemBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(itemBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(res.logs[0].event, 'Sold', 'Error: Invalid event')

        assert.equal(itemBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(itemBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        
    })    

    it('Testing smart contract function shipItem() that allows a distributor to ship coffee', async() => {
        const supplyChain = await SupplyChain.deployed()
        
        const res = await supplyChain.shipItem(upc, { "from": distributorID });
        
        const itemBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const itemBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        assert.equal(itemBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(itemBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(itemBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(itemBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(res.logs[0].event, 'Shipped', 'Error: Invalid event')

        assert.equal(itemBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
              
    })    

    it('Testing smart contract function receiveItem() that allows a retailer to mark coffee received', async() => {
        const supplyChain = await SupplyChain.deployed()
        
        const res = await supplyChain.receiveItem(upc, { "from": retailerID });
        
        const itemBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const itemBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        assert.equal(itemBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(itemBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(itemBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(itemBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(res.logs[0].event, 'Received', 'Error: Invalid event')

        assert.equal(itemBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        assert.equal(itemBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')
             
    })    

    it('Testing smart contract function purchaseItem() that allows a consumer to purchase coffee', async() => {
        const supplyChain = await SupplyChain.deployed()
        
        const res = await supplyChain.purchaseItem(upc, { "from": consumerID });
        
        const itemBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const itemBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        assert.equal(itemBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(itemBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(itemBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(itemBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(res.logs[0].event, 'Purchased', 'Error: Invalid event')

        assert.equal(itemBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        assert.equal(itemBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')
        assert.equal(itemBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID')
        
    })    

    it('Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain', async() => {
        const supplyChain = await SupplyChain.deployed()

        const itemBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        
        assert.equal(itemBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(itemBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(itemBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(itemBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(itemBufferOne[4], originFarmName, 'Error: Invalid item originFarmName')
        assert.equal(itemBufferOne[5], originFarmInformation, 'Error: Invalid item originFarmInformation')
        assert.equal(itemBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(itemBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        
    })

    it('Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain', async() => {
        const supplyChain = await SupplyChain.deployed()

        const itemBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
        
        assert.equal(itemBufferTwo[0], sku, 'Error: Invalid item SKU')
        assert.equal(itemBufferTwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(itemBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(itemBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(itemBufferTwo[4], productPrice, 'Error: Invalid item originFarmName')
        assert.equal(itemBufferTwo[5], 7, 'Error: Invalid item itemState')
        assert.equal(itemBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        assert.equal(itemBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')
        assert.equal(itemBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID')
        
    })

});


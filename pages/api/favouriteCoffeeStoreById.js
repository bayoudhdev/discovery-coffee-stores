import {findRecordByFilter, getMinifiedRecords, table} from "../../lib/airtable";

const FavouriteCoffeeStoreById = async (req, res) => {
    if (req.method === "PUT") {
        try {
            const {id, voting} = req.body;
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    const record = records[0];
                    if (voting) {
                        const updateRecords = await table.update([{
                            id: record.recordId,
                            fields: {
                                voting: parseInt(voting)
                            },
                        }]);
                        if (updateRecords) {
                            res.json(getMinifiedRecords(updateRecords));
                        }
                    } else {
                        res.status(400);
                        res.json({message: "Voting is missing"});
                    }
                } else {
                    res.status(400);
                    res.json({message: "Coffee store id doesn't exist !", id});
                }

            } else {
                res.status(400);
                res.json({message: "Id is missing"});
            }
        } catch (exception) {
            res.status(500);
            res.json({message: "Something went wrong", exception});
        }
    } else {
        res.status(500);
        res.json({message: "Something went wrong"});
    }
}

export default FavouriteCoffeeStoreById;
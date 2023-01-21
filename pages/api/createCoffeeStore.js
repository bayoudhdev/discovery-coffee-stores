import {findRecordByFilter, getMinifiedRecords, table} from "../../lib/airtable";

const CreateCoffeeStores = async (req, res) => {
    if (req.method === "POST") {
        try {
            const {id, name, address, neighborhood, imgUrl, voting} = req.body;
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    res.json(records);
                } else {
                    if (name) {
                        const createRecords = await table.create([{
                            fields: {
                                id,
                                name,
                                address,
                                neighborhood,
                                imgUrl,
                                voting
                            }
                        }]);
                        res.json(getMinifiedRecords(createRecords));
                    } else {
                        res.status(400);
                        res.json({message: "Name is missing"});
                    }
                }
            } else {
                res.status(400);
                res.json({message: "Id is missing"});
            }
        } catch (err) {
            res.status(500);
            res.json({message: "Something went wrong", err});
        }
    } else {
        res.status(500);
        res.json({message: "Something went wrong"});
    }
};


export default CreateCoffeeStores;
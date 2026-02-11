import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});


const hashed_once = [];
const hashed_twice = {};

app.post("/hashed_once", (req, res) => {
  const {value} = req.body;
  const id = value.userId;
  const pos = value.pos;

  const positions = hashed_once.filter((e) =>  e.id != id)
  const data = {id, pos};
  console.log("Adding user to hashed once", data.id); 
  const index = hashed_once.findIndex(e => e.id == id);
  if(index == -1){
    hashed_once.push(data);
  }else{
    hashed_once[index] = data;
  }
  res.json({ok: true, positions});
});

app.get("/hashed_once", (req, res) => {
  res.json({ok: true, positions: hashed_once});
});

app.post("/hashed_twice", (req, res) => {
  const {value} = req.body;
  
  const id = value.id;
  const nearby_users = [];

  if(!hashed_twice[id]){
    hashed_twice[id] = value.hashes; // hashes = {id: [h(p0), h(p1), ...]}
  }else{
    for(const key in value.hashes){
      hashed_twice[id] = value.hashes;
      if(hashed_twice[key]){
        if(hashed_twice[key][id]){
          const set1 = hashed_twice[key][id];
          const set2 = hashed_twice[id][key];
          const intersection = set1.filter(hash => set2.includes(hash));
          if(intersection.length > 0){
            nearby_users.push({user: key, matches: intersection});
          }
        }
      }
    }
  }
  res.json({ok: true, nearby_users});
});
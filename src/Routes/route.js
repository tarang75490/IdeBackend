const express = require('express')
const app = new express.Router()
const axios = require("axios")
var base64 = require('base-64');
jsStringEscape = require('js-string-escape')
console.log(process.env.KEY)
axios.defaults.headers.common['x-rapidapi-host'] = "judge0.p.rapidapi.com";
axios.defaults.headers.common['x-rapidapi-key'] = process.env.KEY.toString();
axios.defaults.headers.common['useQueryString'] = true
axios.defaults.headers.common['content-type'] = "application/json"
axios.defaults.headers.common['accept'] = "application/json"

app.get("/getLanguages",async (req,res)=>{
    try{    
        let response = await axios.get("https://judge0.p.rapidapi.com/languages");
        console.log(response.data)
        res.status(200).send({
            status:"success",
            response : response .data
        });
    }catch(e){
        console.log("Dasd")
        res.status(500).send(e);
    }
})
let code = 
"#include <stdio.h>\n\nint main(void) {\n  char name[10];\n  scanf(\"%s\", name);\n  printf(\"hello, %s\n\", name);\n  return 0;\n}";

app.post("/submitCode",async (req,res)=>{
    try{    
        var code = req.body.code
        console.log(code);
        const buff = Buffer.from(code, 'utf-8');
        const base64 = buff.toString('base64');
        const buff1 = Buffer.from(req.body.input||"", 'utf-8');
        const input = buff1.toString('base64');
        console.log(base64)
        let response = await axios.post("https://judge0.p.rapidapi.com/submissions?base64_encoded=true",{
            language_id:req.body.languageId,
            source_code: base64,
            stdin: input 
    });
            console.log(response)
        res.status(200).send({
            status:"success",
            response : response.data
        });
    }catch(e){  
        console.log(e)
        res.status(200).send(e);
    }
})

app.get("/getResult/:token",async (req,res)=>{
    try{    
        console.log(req.params)
        let response = await axios.get("https://judge0.p.rapidapi.com/submissions/"+req.params.token+"?base64_encoded=true")
        
        console.log(response.data)
        if(response.data.compile_output){
            const buff = Buffer.from(response.data.compile_output, 'base64');
            const str = buff.toString('utf-8');
            res.status(200).send({
                status:"failure",
                response : str,
                time:response.data.time,
                memory:response.data.memory,
                date:Date(),
                description:response.data.status.description
            });
        }else if(response.data.stderr){
            const buff = Buffer.from(response.data.stderr, 'base64');
            const str = buff.toString('utf-8');
            res.status(200).send({
                status:"failure",
                response : str,
                time:response.data.time,
                memory:response.data.memory,
                date:Date(),
                description:response.data.status.description
            });
        }
        const buff = Buffer.from(response.data.stdout||" ", 'base64');
        const str = buff.toString('utf-8');
        console.log(str)
        res.status(200).send({
            status:"success",
            response : str,
            time:response.data.time,
            memory:response.data.memory,
            date:Date(),
            description:response.data.status.description
        });
    }catch(e){
        console.log("Dasd")
        res.status(200).send(e);
    }
})

module.exports = app
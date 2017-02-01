/// <reference path="../../../typings/express/express.d.ts"/>
/// <reference path="../../../typings/body-parser/body-parser.d.ts"/>

import {Request, Response, Application} from "express";
import {Info} from '../shared/models/info';


interface InfoREST {
  name: string;
  message: { total: string,
             customer: string   
         }
      
}; 

var app: Application = require('express')(),
    bodyParser = require('body-parser'),
    backend = require('./backend');

app.use(bodyParser.json());app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

var bk = backend(process.env.DATABASE_URL);

function createCallback(res: Response, onSuccess: (data: any) => void) {
  return function callback(err: Error, data: any) {
    if (err || !data) {
      res.send(500, 'Something bad happened!');
      return;
    }

    onSuccess(data);
  }
};

function processingTime(req: Request, info: Info[]): InfoREST[] {
    let infoLst: Info[] = [];
    info.forEach(element => {
        infoLst.push(element);
    });

    return infoLst;
};

function inboxCount(req: Request, info: Info[]): InfoREST[] {
    let infoLst: Info[] = [];
    info.forEach(element => {
        infoLst.push(element);
    });

    return infoLst;
};


function getProcessingTime(req: Request) {
  return function(info: Info[]) {
    return processingTime(req, info);
  };
}

function getInboxCount(req: Request) {
  return function(info: Info[]) {
    return inboxCount(req, info);
  };
}


app.get('/:client', function(req, res) {
  bk.all(createCallback(res, function(bk) {
    res.send(bk.map(getProcessingTime(req)));
  }));
});


app.get('/:warning/:critical', function(req, res) {
  bk.get(req.params.id, createCallback(res, function(todo) {
    res.send(processingTime(req, todo));
  }));
});


app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
import axios from 'axios';
import { DataFrame } from "dataframe-js";

const PAGE_URL = 'https://www.swpa.gov/gen';
const WEEK_DAYS = ['sun','mon','tue','wed','thu','fri','sat', 'cur'];
const PROJECTS = ['BBD','BEV','BSD','CAN','DAD','DEN','EUF','FGD','GFD','HST','KEY','NFD','OZK','RSK','STD','TKD','TRD','WFD'];
const PROJECTS_MAP = {
  BBD: 'Broken Bow',
  BEV: 'Beaver',
  BSD: 'Bull Shoals',
  CAN: 'Clarence Cannon',
  DAD: 'Dardanelle L&D',
  DEN: 'Denison',
  EUF: 'Eufaula',
  FGD: 'Fort Gibson',
  GFD: 'Greers Ferry',
  HST: 'Harry S Truman',
  KEY: 'Keystone',
  NFD: 'Norfork',
  OZD: 'Ozark L&D',
  OZK: 'Ozark L&D',
  RSK: 'Robert S. Kerr L&D',
  STD: 'Stockton',
  TKD: 'Tenkiller',
  TRD: 'Table Rock',
  WFD: 'Webbers Falls L&D',
}
const PROJECTS_OBJ = [
  { id: 'BBD', name: 'Broken Bow' },     
  { id: 'BEV', name: 'Beaver' },
  { id: 'BSD', name: 'Bull Shoals' },    
  { id: 'CAN', name: 'Clarence Cannon' },
  { id: 'DAD', name: 'Dardanelle L&D' }, 
  { id: 'DEN', name: 'Denison' },        
  { id: 'EUF', name: 'Eufaula' },        
  { id: 'FGD', name: 'Fort Gibson' },
  { id: 'GFD', name: 'Greers Ferry' },
  { id: 'HST', name: 'Harry S Truman' },
  { id: 'KEY', name: 'Keystone' },
  { id: 'NFD', name: 'Norfork' },
  { id: 'OZK', name: 'Ozark L&D' },
  { id: 'RSK', name: 'Robert S. Kerr L&D' },
  { id: 'STD', name: 'Stockton' },
  { id: 'TKD', name: 'Tenkiller' },
  { id: 'TRD', name: 'Table Rock' },
  { id: 'WFD', name: 'Webbers Falls L&D' }
]

// let html = '';

async function getSwepcoPageDoc(day) {
  return await axios.get(`${PAGE_URL}/${day}.htm`)
    .then(res => res.data);
}

// todo: ozk/ozd exception
// auto: ({...html.match(new RegExp('(?<='+key+'[ ]{4,})(\\w.+?)(?=[ ]{2})', 'gm'))});
const getProjectName = (key) => PROJECTS_MAP[key];

// find each row of the table from html and return as array of rows
const separateRows = (table) => table.match(/(?<=^ *\w{1,3}\s+)(?:\w+[ ]+){17}\w+$/gm);

// split each row string into array of columns
const separateCols = (rows) => rows.map(row => row.trim().split(/\s+/));

const getTable = (html) => separateCols(separateRows(html));

const getDate = (str) => {
  const capitalize = (s) => {
    if (typeof s !== 'string') { return '' };
    s = s.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  const matchDate = /((?:sun|mon|tue|wed|thu|fri|sat)+\w+)\s*(\w+)\s*(0[1-9]|[12][0-9]|3[01]),\s*((?:19|20)\d\d)/i;
  const date = matchDate.exec(str).slice(1);
  const [weekDay, month, day, year] = date.map(str => capitalize(str));
  const fullDate = `${weekDay} ${month}, ${day} ${year}`;

  return { fullDate, weekDay, month, day, year };
}

const dfToObject = (data) => Object.entries(JSON.parse(data))
  .map(([key, value]) => ({
    id: key,
    // name: getProjectName(key),
    total: value.pop(),
    timeline: value
  }));

function getSchedules(day, key = '') {
  return getSwepcoPageDoc(day).then(html => {
    const date = getDate(html);
    console.log(date);
    const [columns, ...data] = getTable(html);
    const df = new DataFrame(data, columns).restructure(PROJECTS);
    const schedules = key ? df.select(key).toJSON() : df.toJSON();
    const schedObj = dfToObject(schedules);
    return { schedules: schedObj, date };
  }).catch(err => {
    return new Error('RETURNING', err);
  })
}

function getProjects() {
  return PROJECTS_OBJ;
}

export { getSchedules, getProjects, PROJECTS, WEEK_DAYS };
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  getDatabase,
  ref,
  onValue,
  push as firebasePush,
  set as firebaseSet,
  update as firebaseUpdate
} from 'firebase/database';



export function Tags(props) {
  const { userID, gameID, tagState, setFunc } = props;
  console.log("setFunc");
  const changeSelectedTag = (tagName, userID, gameID) => {

    console.log("changeSelectedTag gameID: " + gameID);
    const db = getDatabase();
    let dbRef = ref(db, 'gameLists/' + userID);

    let addToDb = {}
    addToDb[gameID] = tagName;

    firebaseUpdate(dbRef, addToDb);
  }



  let tags = (
    <div className="container" id="tags">
      <div className={selectTag(tagState, 'playing')} onClick={(event) => { setFunc("playing") }}>
        PLAYING
      </div>
      <div className={selectTag(tagState, 'completed')} onClick={(event) => { setFunc("completed") }}>
        COMPLETED
      </div>
      <div className={selectTag(tagState, 'planned')} onClick={(event) => { setFunc("planned"); }}>
        PLANNED
      </div>
      <div className={selectTag(tagState, 'stopped')} onClick={(event) => { setFunc("stopped"); }}>
        STOPPED
      </div>
    </div>
  );

  useEffect(() => {
    changeSelectedTag(tagState, userID, gameID);
  }, [tagState]);

  return tags;
}

function selectTag(selectedTag, currentTag, responsive) {
  let returnClass = "";
  if (selectedTag == currentTag) {
    returnClass = "tag selected";
  }
  else {
    returnClass = "tag";
  }
  if (responsive == true) {
    returnClass = returnClass + " responsive";
  }
  return returnClass;
}

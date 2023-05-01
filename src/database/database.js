import axios from "axios";
import { initializeApp } from "firebase/app";
import { get } from "firebase/database";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
  deleteObject,
} from "firebase/storage";

const URL = "https://licenta-app-d5390-default-rtdb.firebaseio.com";
const firebaseConfig = {
  apiKey: "AIzaSyDsLVolgcinnOftVe039_cqLoq1igAiDeQ",
  authDomain: "licenta-app-d5390.firebaseapp.com",
  projectId: "licenta-app-d5390",
  storageBucket: "licenta-app-d5390.appspot.com",
  messagingSenderId: "663433490784",
  appId: "1:663433490784:web:476ba53ad7322e8cb8ae05",
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function addFriend(id, gender, name, birthday, interests) {
  const response = await axios.post(URL + `/users/${id}/friends.json`, {
    gender: gender,
    name: name,
    birthday: birthday,
    interests: interests,
    receivedGift: 0,
    giftName: "noGiftName",
    giftPrice: 0,
    giftDate: "noGiftDate",
  });
  const friendId = response.data.name;

  return friendId;
}

export async function deleteFriend(userId, friendId, formattedPath) {
  await deleteImage(formattedPath);
  const response = await axios.delete(
    URL + `/users/${userId}/friends/${friendId}.json`
  );
  return response.data;
}

export async function editFriend(userId, friendId, friendData) {
  const response = await axios.patch(
    URL + `/users/${userId}/friends/${friendId}.json`,
    friendData
  );
  return response.data;
}

export async function getUsersFriend(id) {
  const friends = [];
  const response = await axios.get(URL + `/users/${id}/friends.json`);
  for (const key in response.data) {
    // console.log(response.data);
    const friendsRetrieved = {
      gender: response.data[key].gender,
      name: response.data[key].name,
      birthday: response.data[key].birthday,
      interests: response.data[key].interests,
      receivedGift: response.data[key].receivedGift,
      giftName: response.data[key].giftName,
      giftPrice: response.data[key].giftPrice,
      giftDate: response.data[key].giftDate,
      key: key,
      image: await getImageURL(`friends/${id}/${key}.jpeg`),
    };
    // console.log(friendsRetrieved);
    friends.push(friendsRetrieved);
  }
  return friends;
}

export async function getFriendInterests(idUser, idFriend) {
  const response = await axios.get(
    URL + `/users/${idUser}/friends/${idFriend}.json`
  );
  const friendInterests = {
    interests: response.data.interests,
  };
  return friendInterests;
}

export async function getFemaleInterests(idInterest, indexOfInterest) {
  const response = await axios.get(
    URL + `/interests/female/${idInterest}/${indexOfInterest}.json`
  );
  const femaleInterests = {
    informationInterests: response.data,
    imageInterests: await getImageURL(
      `interests/female/${idInterest}/${indexOfInterest}.jpg`
    ),
  };
  // console.log(femaleInterests);
  return femaleInterests;
}

// getFemaleInterests("F01", "F011");

export async function getImageURL(path) {
  const imageRef = ref(storage, path);
  const URL = await getDownloadURL(imageRef).then((responseURL) => {
    return responseURL;
  });

  return URL;
}

export async function addImage(path, formattedPath) {
  const imageRef = ref(storage, formattedPath);
  console.log(imageRef);
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", path, true);
    xhr.send(null);
  });
  const snap = await uploadBytes(imageRef, blob);
  blob.close();
  return snap;
}

export async function deleteImage(formattedPath) {
  const imageRef = ref(storage, formattedPath);
  await deleteObject(imageRef);
}

export async function editImage(path, newPath) {
  const imageRef = ref(storage, path);
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", newPath, true);
    xhr.send(null);
  });
  const snap = await uploadBytes(imageRef, blob);
  console.log(snap);
  blob.close();
  return snap;
}

export async function addNotification(idUser, idFriend, name, birthday) {
  const response = await axios.post(URL + `/notifications.json`, {
    idUser: idUser,
    idFriend: idFriend,
    name: name,
    birthday: birthday,
  });
  const notificationId = response.data.name;

  return notificationId;
}

export async function deleteNotification(idNotification) {
  const response = await axios.delete(
    URL + `/notifications/${idNotification}.json`
  );
  return response;
}

export async function getUsersNotification(idUser) {
  let notificationDetails = [];
  const response = await axios.get(URL + `/notifications.json`);
  if (response.data) {
    const notificationKeys = Object.keys(response.data);
    const notifications = Object.values(response.data);
    notifications.map((notification, index) => {
      notification.key = notificationKeys[index];
    });
    const filtered = notifications.filter(function (notification) {
      return notification.idUser === idUser;
    });
    for (const key in filtered) {
      const notificationRetrieved = {
        idFriend: filtered[key].idFriend,
        name: filtered[key].name,
        birthday: filtered[key].birthday,
      };
      notificationDetails.push(notificationRetrieved);
    }
  }
  return notificationDetails;
}

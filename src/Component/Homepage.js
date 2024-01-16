import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Papa from "papaparse";
import { saveAs } from "file-saver";

export const Homepage = () => {
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    hexCode: generate16DigitHexCode(),
  });
  const [userDetails, setUserDetails] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const encryptedDetails = localStorage.getItem("userDetails");
    if (encryptedDetails) {
      const decryptedDetails = CryptoJS.AES.decrypt(
        encryptedDetails,
        "your-secret-key"
      ).toString(CryptoJS.enc.Utf8);

      try {
        const parsedDetails = JSON.parse(decryptedDetails);
        setUserDetails(parsedDetails);
      } catch (error) {
        console.error("Error parsing decrypted user details:", error);
      }
    }
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedDetails = Array.from(userDetails);
    const [removed] = updatedDetails.splice(result.source.index, 1);
    updatedDetails.splice(result.destination.index, 0, removed);

    setUserDetails(updatedDetails);
    saveToLocalStorage(updatedDetails);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEdit = (recordHash) => {
    const recordToEdit = userDetails.find(
      (user) => hashRecord(user) === recordHash
    );
    if (recordToEdit) {
      setUserData({
        email: "",
        username: recordToEdit.username,
        hexCode: generate16DigitHexCode(),
      });
      setSelectedRecord(recordHash);
    }
  };

  const handleDelete = (recordHash) => {
    const updatedDetails = userDetails.filter(
      (user) => hashRecord(user) !== recordHash
    );
    setUserDetails(updatedDetails);
    saveToLocalStorage(updatedDetails);
  };

  const handleSave = () => {
    if (selectedRecord) {
      const updatedDetails = userDetails.map((user) =>
        hashRecord(user) === selectedRecord
          ? { ...user, username: userData.username }
          : user
      );
      setUserDetails(updatedDetails);
      saveToLocalStorage(updatedDetails);
      setSelectedRecord(null);
      setUserData({
        email: "",
        username: "",
        hexCode: generate16DigitHexCode(),
      }); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRecord) {
      const updatedDetails = userDetails.map((user) =>
        hashRecord(user) === selectedRecord ? { ...user, ...userData } : user
      );
      setUserDetails(updatedDetails);
      saveToLocalStorage(updatedDetails);
      setSelectedRecord(null);
      setUserData({
        email: "",
        username: "",
        hexCode: generate16DigitHexCode(),
      }); 
    } else {
      setUserDetails((prevDetails) => [...prevDetails, userData]);
      saveToLocalStorage([...userDetails, userData]);
      setUserData({
        email: "",
        username: "",
        hexCode: generate16DigitHexCode(),
      });
    }
  };

  const hideUsernameInEmail = (email) => {
    const [username, domain] = email.split("@");
    return `${username.substring(0, 3)}***@${domain}`;
  };

  function generate16DigitHexCode() {
    const hexCode = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    return hexCode.toUpperCase();
  }

  const hashRecord = (record) => {
    return CryptoJS.SHA256(JSON.stringify(record)).toString();
  };

  const saveToLocalStorage = (data) => {
    const encryptedDetails = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      "your-secret-key"
    ).toString();
    localStorage.setItem("userDetails", encryptedDetails);
  };

  const handleDownloadCSV = () => {
    const csvData = Papa.unparse(userDetails);

    const encryptedCSV = CryptoJS.AES.encrypt(
      csvData,
      "csv-password"
    ).toString();

    const csvBlob = new Blob([encryptedCSV], {
      type: "text/csv;charset=utf-8",
    });

    saveAs(csvBlob, "protected-user-details.csv");
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <div className="md:w-1/2 py-0 md:py-8 flex items-center justify-center flex-col">
        <form onSubmit={handleSubmit} className="text-center w-full md:w-2/3">
          <h2 className="text-6xl mb-4">
            Join{" "}
            <b className="text-[#D97083]">
              Unique <br /> Schools
            </b>
          </h2>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-2/3 p-2 border bg-gray-100 mb-4 rounded-md placeholder-black placeholder-opacity-100"
            placeholder="Email"
            required
          />

          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            className="w-2/3 p-2 border bg-gray-100 mb-4 rounded-md placeholder-black placeholder-opacity-100"
            placeholder="Username"
            required
          />

          <input
            type="text"
            name="hexCode"
            value={userData.hexCode}
            onChange={handleChange}
            className="w-2/3 p-2 border bg-gray-100 mb-4 rounded-md placeholder-black placeholder-opacity-100"
            placeholder="16 dig hex code"
            required
          />

          <div>
            <button
              type="submit"
              className="bg-[#D97083] text-black px-16 py-1 rounded-full font-bold"
            >
              {selectedRecord ? "Edit" : "Join"}
            </button>
          </div>
        </form>
      </div>

      <div className="md:w-1/2 w-full p-8 m-auto">
        <h2 className="text-5xl flex font-medium mb-4 gap-2">
          <p className="text-[#D97083] font-bold">{userDetails.length}</p>{" "}
          Joinee's
        </h2>
        <div className="table-responsive">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={userDetails.length}>
              {(provided) => (
                <table
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="w-full border-collapse"
                >
                  <tbody>
                    {userDetails.map((user, index) => (
                      <Draggable
                        key={hashRecord(user)}
                        draggableId={hashRecord(user)}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className={
                              index % 2 === 0 ? "bg-[#f8bfc9]" : "bg-[#f8dde2]"
                            }
                          >
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">
                              {selectedRecord === hashRecord(user) ? (
                                <input
                                  type="text"
                                  name="username"
                                  value={userData.username}
                                  onChange={(e) =>
                                    setUserData({
                                      ...userData,
                                      username: e.target.value,
                                    })
                                  }
                                  className="w-full p-2 border bg-gray-100 rounded-md placeholder-black placeholder-opacity-100"
                                  placeholder="Username"
                                  required
                                />
                              ) : (
                                user.username
                              )}
                            </td>
                            <td className="border p-2">{user.hexCode}</td>
                            <td className="border p-2 hidden sm:table-cell">
                              {hideUsernameInEmail(user.email)}
                            </td>
                            <td className="border p-2">
                              {selectedRecord === hashRecord(user) ? (
                                <>
                                  <button
                                    type="button"
                                    className="text-blue-600 hover:underline mr-2"
                                    onClick={() => handleSave()}
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="text-red-600 hover:underline"
                                    onClick={() => setSelectedRecord(null)}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="text-blue-600 hover:underline mr-2"
                                    onClick={() => handleEdit(hashRecord(user))}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="text-red-600 hover:underline"
                                    onClick={() =>
                                      handleDelete(hashRecord(user))
                                    }
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="mt-4">
          <button
            onClick={handleDownloadCSV}
            className="bg-[#D97083] text-black px-4 py-2 rounded-full font-bold"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

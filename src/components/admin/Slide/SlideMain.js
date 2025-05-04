import React, { useState, useEffect } from "react";
import { storage } from "../../user/StorageImageText/TxtImageConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { ClipLoader } from "react-spinners"; // Import the spinner

export default function SlideMain() {
  const [rows, setRows] = useState([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedSlides, setSelectedSlides] = useState([]);
  const [isLoadingMultiple, setIsLoadingMultiple] = useState(false); // for multi-upload
  const [loadingImage, setLoadingImage] = useState({}); // for individual image

  useEffect(() => {
    const fetchSlides = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast("Token không tồn tại!", {
          type: "error",
          position: "top-right",
          duration: 3000,
          closeButton: true,
          richColors: true,
        });
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/admin/api/slides/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRows(
          response.data.map((slide) => ({
            id: slide.id,
            image_SlideShow: slide.image_SlideShow,
            dbId: slide.id,
          }))
        );
      } catch (error) {
        toast("Lỗi khi tải danh sách ảnh!", {
          type: "error",
          position: "top-right",
          duration: 3000,
          closeButton: true,
          richColors: true,
        });
      }
    };

    fetchSlides();
  }, []);

  const toggleMultiSelect = () => {
    setIsMultiSelect(!isMultiSelect);
    setSelectedSlides([]);
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), image_SlideShow: "" }]);
  };

  const deleteSelectedSlides = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast("Token không tồn tại!", {
        type: "error",
        position: "top-right",
        duration: 3000,
        closeButton: true,
        richColors: true,
      });
      return;
    }

    try {
      const promises = selectedSlides.map((slideId) =>
        axios.delete(
          `http://localhost:8080/admin/api/slides/delete/${slideId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );
      await Promise.all(promises);
      setRows(rows.filter((row) => !selectedSlides.includes(row.dbId)));
      toast("Đã xóa ảnh đã chọn!", {
        type: "success",
        position: "top-right",
        duration: 3000,
        closeButton: true,
        richColors: true,
      });
      setSelectedSlides([]);
      setIsMultiSelect(false);
    } catch (error) {
      toast("Lỗi xóa ảnh!", {
        type: "error",
        position: "top-right",
        duration: 3000,
        closeButton: true,
        richColors: true,
      });
    }
  };

  const handleSelectSlide = (slideId) => {
    if (selectedSlides.includes(slideId)) {
      setSelectedSlides(selectedSlides.filter((id) => id !== slideId));
    } else {
      setSelectedSlides([...selectedSlides, slideId]);
    }
  };

  const handleSingleFileChange = async (event, row) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoadingImage({ ...loadingImage, [row.id]: true }); // Set loading state for individual image

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("Token không tồn tại!");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      if (img.width < 1200 || img.height < 500) {
        toast(
          "Kích thước ảnh không đủ. Chiều ngang tối thiểu là 1200px và chiều cao tối thiểu là 500px.",
          {
            type: "error",
            position: "top-right",
            duration: 3000,
            closeButton: true,
            richColors: true,
          }
        );

        setLoadingImage({ ...loadingImage, [row.id]: false });
        return;
      }

      const storageRef = ref(storage, `slides/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);

        if (row.dbId) {
          await axios.put(
            `http://localhost:8080/admin/api/slides/update/${row.dbId}`,
            { image_SlideShow: imageUrl },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setRows(
            rows.map((r) =>
              r.id === row.id ? { ...r, image_SlideShow: imageUrl } : r
            )
          );
          toast("Cập nhật ảnh thành công!", {
            type: "success",
            position: "top-right",
            duration: 3000,
            closeButton: true,
            richColors: true,
          });
        } else {
          const newSlide = {
            image_SlideShow: imageUrl,
            user: { id: 1 },
          };

          const response = await axios.post(
            "http://localhost:8080/admin/api/slides/add",
            newSlide,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setRows(
            rows.map((r) =>
              r.id === row.id
                ? { ...r, image_SlideShow: imageUrl, dbId: response.data.id }
                : r
            )
          );
          toast("Tải ảnh lên thành công!", {
            type: "success",
            position: "top-right",
            duration: 3000,
            closeButton: true,
            richColors: true,
          });
        }
      } catch (error) {
        toast("Lỗi khi tải hoặc cập nhật ảnh", {
          type: "error",
          position: "top-right",
          duration: 3000,
          closeButton: true,
          richColors: true,
        });
      } finally {
        setLoadingImage({ ...loadingImage, [row.id]: false }); // Reset loading state
      }
    };
  };

  const handleMultipleFilesChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsLoadingMultiple(true); // Set loading state for multiple upload

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast("Token không tồn tại!", {
        type: "error",
        position: "top-right",
        duration: 3000,
        closeButton: true,
        richColors: true,
      });
      setIsLoadingMultiple(false);
      return;
    }

    const newRows = [];
    for (let file of files) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      await new Promise((resolve) => {
        img.onload = async () => {
          if (img.width < 1200 || img.height < 500) {
            toast(
              `Kích thước ảnh không đủ cho file ${file.name}. Chiều ngang tối thiểu là 1200px và chiều cao tối thiểu là 500px.`,
              {
                type: "error",
                position: "top-right",
                duration: 3000,
                closeButton: true,
                richColors: true,
              }
            );

            resolve();
            return;
          }

          const storageRef = ref(storage, `slides/${file.name}`);
          try {
            await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(storageRef);

            const newSlide = {
              image_SlideShow: imageUrl,
              user: { id: 1 },
            };

            const response = await axios.post(
              "http://localhost:8080/admin/api/slides/add",
              newSlide,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            newRows.push({
              id: Date.now() + Math.random(),
              image_SlideShow: imageUrl,
              dbId: response.data.id,
            });
            toast(`Tải ảnh ${file.name} thành công!`, {
              type: "success",
              position: "top-right",
              duration: 3000,
              closeButton: true,
              richColors: true,
            });
          } catch (error) {
            toast(`Lỗi khi tải ảnh ${file.name}`, {
              type: "error",
              position: "top-right",
              duration: 3000,
              closeButton: true,
              richColors: true,
            });
          }
          resolve();
        };
      });
    }
    setRows([...rows, ...newRows]);
    setIsLoadingMultiple(false); // Reset loading state after upload
  };

  // Define removeRow function
  const removeRow = async (row) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast("Token không tồn tại!", {
        type: "error",
        position: "top-right",
        duration: 3000,
        closeButton: true,
        richColors: true,
      });
      return;
    }

    if (!row.image_SlideShow) {
      setRows(rows.filter((r) => r.id !== row.id));
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/admin/api/slides/delete/${row.dbId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRows(rows.filter((r) => r.id !== row.id));
      toast("Đã xóa ảnh thành công!", {
        type: "success",
        position: "top-right",
        duration: 3000,
        closeButton: true,
        richColors: true,
      });
    } catch (error) {
      toast("Lỗi khi xóa ảnh!", {
        type: "eror",
        position: "top-right",
        duration: 3000,
        closeButton: true,
        richColors: true,
      });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 space-y-4">
      <div className="w-full max-w-4xl mt-4 flex justify-between items-center">
      <Toaster position="top-right" reverseOrder={false} />
        <h1 className="text-left text-2xl font-bold text-gray-700 mb-6 mt-5">
          Danh sách Slides
        </h1>
       
        <div className="space-x-4">
          <label className="bg-blue-500 text-white px-4 py-4 rounded-lg cursor-pointer">
            {isLoadingMultiple ? (
              <ClipLoader size={20} color="#ffffff" />
            ) : (
              "Thêm nhiều ảnh"
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleMultipleFilesChange}
              disabled={isLoadingMultiple}
            />
          </label>
          <button
            onClick={toggleMultiSelect}
            className="bg-gray-500 text-white px-4 py-3 rounded-lg"
          >
            {isMultiSelect ? "Hủy" : "Chọn nhiều"}
          </button>
          {isMultiSelect && (
            <button
              onClick={deleteSelectedSlides}
              className="bg-red-500 text-white px-4 py-3 rounded-lg"
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 w-full max-w-4xl">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between p-8 bg-gradient-to-r from-cyan-200 to-cyan-300 rounded-lg border border-blue-300 shadow-sm transition-transform transform duration-500 ease-in-out w-full h-28"
          >
            <label className="flex items-center space-x-6 cursor-pointer">
              {loadingImage[row.id] ? (
                <ClipLoader size={20} color="#000000" />
              ) : row.image_SlideShow ? (
                <img
                  src={row.image_SlideShow}
                  alt="Slide"
                  className="w-75 h-24 object-cover rounded-lg"
                  onClick={() =>
                    document
                      .getElementById(`single-file-input-${row.id}`)
                      .click()
                  }
                />
              ) : (
                <div className="px-8 py-4 bg-blue-400 text-white font-semibold rounded-lg shadow text-lg">
                  Hình ảnh
                </div>
              )}
              <input
                type="file"
                id={`single-file-input-${row.id}`}
                className="hidden"
                accept="image/*"
                onChange={(event) => handleSingleFileChange(event, row)}
              />
            </label>
            {isMultiSelect ? (
              <input
                type="checkbox"
                checked={selectedSlides.includes(row.dbId)}
                onChange={() => handleSelectSlide(row.dbId)}
                className="w-6 h-6"
              />
            ) : (
              <button
                onClick={() => removeRow(row)}
                className="px-6 py-3 bg-red-100 text-red-500 font-semibold rounded border border-red-300 hover:bg-red-200 text-lg"
              >
                Xóa
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={addRow}
          className="flex items-center justify-center w-14 h-14 bg-green-500 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-green-600"
        >
          +
        </button>
      </div>
    </div>
  );
}

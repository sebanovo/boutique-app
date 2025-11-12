import { Popover } from "../Popover/Popover";
import { useState, useEffect } from "react";
import Css from "./Formulario.module.css";
import { toast } from "react-toastify";

function v(nro, data) {
  const vector = data.split("-");
  return vector[nro - 1];
}

// 🔑 Tu API key de imgbb
const IMGBB_API_KEY = "a224f36313d7c8d81307b1d21747b9be";

export function Formulario({ data }) {
  const [formValues, setFormValues] = useState(() => {
    const inputs = data.Input.reduce((acc, curr) => {
      acc[v(1, curr)] = "";
      return acc;
    }, {});
    const selects = data.Recibir.reduce((acc, sel) => {
      if (sel.name.includes('-MasDeUno')) {
        const fieldName = sel.name.replace('-MasDeUno', '');
        acc[fieldName] = [];
      } else {
        acc[sel.name] = "";
      }
      return acc;
    }, {});
    return { ...inputs, ...selects };
  });

  const [imagePreviews, setImagePreviews] = useState({});
  const [options, setOptions] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    data.Recibir.forEach(async (sel) => {
      try {
        const response = await fetch(sel.Ruta);
        const json = await response.json();
        setOptions((prev) => ({ ...prev, [sel.name]: json }));
      } catch (error) {
        console.error("Error al cargar opciones:", error);
        setOptions((prev) => ({ ...prev, [sel.name]: [] }));
      }
    });
  }, []);

  const handleCheckboxChange = (fieldName, optionId, isChecked) => {
    setFormValues(prev => {
      const currentValues = prev[fieldName] || [];
      if (isChecked) {
        return { ...prev, [fieldName]: [...currentValues, optionId] };
      } else {
        return { ...prev, [fieldName]: currentValues.filter(id => id !== optionId) };
      }
    });
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormValues({ ...formValues, [name]: file });
      
      // Crear vista previa de la imagen
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => ({
            ...prev,
            [name]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // Eliminar vista previa si no hay archivo
        setImagePreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[name];
          return newPreviews;
        });
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const uploadToImgbb = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1];
        const formData = new FormData();
        formData.append("image", base64Image);

        try {
          const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            { method: "POST", body: formData }
          );
          const result = await response.json();
          if (result?.data?.url) resolve(result.data.url);
          else reject("Error al subir imagen");
        } catch (err) {
          reject(err.message);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMensaje("⏳ Procesando...");
  
    try {
      if (!data.Backendt || data.Backendt.trim() === "") {
        setMensaje("⚠️ No se ha definido la ruta Backendt en el objeto data.");
        setIsSubmitting(false);
        return;
      }
  
      const payload = { ...formValues };
  
      // ✅ AGREGAR CARRITO AL PAYLOAD SI EXISTE
      if (data.carrito && data.carrito.length > 0) {
        payload.productos = data.carrito;
      }
  
      for (const key in formValues) {
        if (formValues[key] instanceof File) {
          const file = formValues[key];
          setMensaje("⏳ Subiendo imagen...");
          const imageUrl = await uploadToImgbb(file);
          payload[key] = imageUrl;
        }
      }
  
      const response = await fetch(data.Backendt, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok && (result.success === true || !result.error)) {
        setMensaje(result.message || "✅ Operación exitosa");
        toast.success("✅ Proceso realizado correctamente");
        handleCancel();
      } else {
        setMensaje(result.message || "❌ Ocurrió un error en el servidor");
        toast.error("❌ Ocurrió un error en el servidor");
      }
    } catch (error) {
      console.error("❌ Error al enviar formulario:", error);
      setMensaje("Error de conexión con el backend ❌");
      toast.error("Error de conexión con el backend ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const resetInputs = data.Input.reduce((acc, curr) => {
      acc[v(1, curr)] = "";
      return acc;
    }, {});
    const resetSelects = data.Recibir.reduce((acc, sel) => {
      if (sel.name.includes('-MasDeUno')) {
        const fieldName = sel.name.replace('-MasDeUno', '');
        acc[fieldName] = [];
      } else {
        acc[sel.name] = "";
      }
      return acc;
    }, {});
    setFormValues({ ...resetInputs, ...resetSelects });
    setImagePreviews({}); // Limpiar todas las vistas previas
  };

  const removeImagePreview = (fieldName) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: ""
    }));
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });
  };

  return (
    <Popover botonTexto={data.Titulo}>
      <form onSubmit={handleSubmit} className={Css.formulario}>
        <center>
          <h1 className={Css.titulo}>{data.Titulo}</h1>
        </center>
        <hr className={Css.linea} />

        {data.Input.map((item, index) => {
          const key = v(1, item);
          const label = v(2, item);
          const type = v(3, item);
          const hasPreview = type === "file" && imagePreviews[key];
          
          return (
            <div className={Css.caja} key={index}>
              <label className={Css.label}>{label}</label>
              <input
                className={Css.input}
                type={type}
                name={key}
                value={type !== "file" ? formValues[key] : undefined}
                onChange={handleChange}
                accept={type === "file" ? "image/*" : undefined}
                required
              />
              
              {/* Vista previa de la imagen */}
              {hasPreview && (
                <div className={Css.previewContainer}>
                  <img 
                    src={imagePreviews[key]} 
                    alt="Vista previa" 
                    className={Css.previewImage}
                  />
                  <button
                    type="button"
                    onClick={() => removeImagePreview(key)}
                    className={Css.removeImageButton}
                  >
                    ✕ Eliminar imagen
                  </button>
                </div>
              )}
            </div>
          );
        })}
        
        {data.Recibir.map((sel, index) => {
          const isMultiple = sel.name.includes('-MasDeUno');
          const fieldName = isMultiple ? sel.name.replace('-MasDeUno', '') : sel.name;
          const displayName = fieldName;
          const [idKey, nameKey] = sel.items || ["id", "nombre"];

          if (isMultiple) {
            const selectedValues = formValues[fieldName] || [];
            return (
              <div className={Css.caja} key={`checkbox-${index}`}>
                <label className={Css.label}>{displayName} (Selección múltiple)</label>
                <div className={Css.checkboxContainer}>
                  {options[sel.name] && options[sel.name].map((opt) => (
                    <label key={opt[idKey]} className={Css.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(opt[idKey])}
                        onChange={(e) =>
                          handleCheckboxChange(fieldName, opt[idKey], e.target.checked)
                        }
                        className={Css.checkboxInput}
                      />
                      <span className={Css.checkboxText}>{opt[nameKey]}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          } else {
            return (
              <div className={Css.caja} key={`select-${index}`}>
                <label className={Css.label}>{displayName}</label>
                <select
                  className={Css.input}
                  name={fieldName}
                  value={formValues[fieldName]}
                  onChange={handleChange}
                  required
                >
                  <option value="">--Seleccionar--</option>
                  {options[sel.name] &&
                    options[sel.name].map((opt) => (
                      <option key={opt[idKey]} value={opt[idKey]}>
                        {opt[nameKey]}
                      </option>
                    ))}
                </select>
              </div>
            );
          }
        })}

        <div className={Css.botones}>
          <button type="submit" className={Css.enviar} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
          <div onClick={handleCancel} className={Css.cancelar}>
            Cancelar
          </div>
        </div>
      </form>
    </Popover>
  );
}
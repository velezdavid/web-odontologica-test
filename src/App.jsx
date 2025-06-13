import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import img1 from './assets/img1.jpg';
import img2 from './assets/img2.jpg';
import logo from './assets/logo.png';

const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  height: '40px',
};

function App() {
  const ref = useRef();
  const [data, setData] = useState(null);
  const [cedula, setCedula] = useState(null);

  const searchHM = async () => {
    const url = `http://localhost:1337/api/historia-medicas?filters[Paciente][Cedula][$eq]=${cedula}&populate=*`;
    const response = await axios.get(url);
    if (response.status === 200 && response?.data?.data.length > 0) {
      setData(response?.data?.data[0]);
      return;
    }

    alert('No existe registro con esa identificación');
  };

  const handleGenerarPDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.html(ref.current, {
      callback: () => {
        doc.save('historia_clinica.pdf');
      },
      margin: [7, 20, 10, 20],
      html2canvas: { scale: 0.54 },
    });
  };

  return (
    <div style={{ margin: 20 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <label htmlFor="search" style={{ fontWeight: 'bold' }}>
          BUSCAR PACIENTE:
        </label>
        <input
          type="text"
          id="search"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          style={{
            padding: '6px 10px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '200px',
          }}
        />
        <button
          style={{
            padding: '6px 16px',
            fontSize: '14px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#1976d2',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#1565c0')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#1976d2')}
          onClick={searchHM}
        >
          Buscar
        </button>{' '}
        <button
          onClick={handleGenerarPDF}
          style={{
            padding: '6px 16px',
            fontSize: '14px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'green',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          Descargar PDF
        </button>
      </div>
      {data && (
        <div
          style={{
            width: '100%',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <div
            ref={ref}
            style={{
              fontFamily: 'Arial',
              fontSize: '12px',
              color: '#000',
              padding: '20px',
              background: '#fff',
              width: '100%',
            }}
          >
            {/* Encabezado */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                style={{ width: 50, height: 50, margin: 'auto' }}
                src={logo}
                alt="logo"
              />
              <h2 style={{ margin: 0 }}>MAS QUE SONRISAS</h2>
              <h4 style={{ margin: '2px 0' }}>CENTRO ODONTOLÓGICO INTEGRAL</h4>
              <h3 style={{ marginBottom: '20px' }}>HISTORIA CLÍNICA</h3>
            </div>

            {/* Datos del doctor y fecha */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  Dr./Dra.: _____________________________________________
                </div>
                <div>No. Ficha: {data.id}</div>
              </div>
              <div style={{ marginTop: '5px' }}>
                Fecha: {new Date(data.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Sección 1: Información personal */}
            <fieldset
              style={{
                border: '1px solid #000',
                padding: '10px',
                marginBottom: '15px',
              }}
            >
              <legend>
                <strong>1. Información Personal</strong>
              </legend>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td>
                      <strong>C.C.:</strong> <span>{data.Paciente.Cedula}</span>
                    </td>
                    <td>
                      <strong>Nombres:</strong>{' '}
                      <span>
                        {data.Paciente.Nombre} {data.Paciente.Apellido}
                      </span>
                    </td>
                    <td>
                      <strong>Fecha de nacimiento:</strong>{' '}
                      <span>{data.Paciente.FechaNacimiento || 'N/D'}</span>
                    </td>
                    <td>
                      <strong>Sexo:</strong>{' '}
                      <span>{data.Paciente.Sexo || 'N/D'}</span>
                    </td>
                    <td>
                      <strong>Edad:</strong>{' '}
                      <span>{data.Paciente.Edad || 'N/D'}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset>

            {/* Sección 2: Contacto y Vivienda */}
            <fieldset
              style={{
                border: '1px solid #000',
                padding: '10px',
                marginBottom: '15px',
              }}
            >
              <legend>
                <strong>2. Información de Contacto y Vivienda</strong>
              </legend>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td>
                      <strong>País:</strong>{' '}
                      <span>{data.Paciente.Pais || 'N/D'}</span>
                    </td>
                    <td>
                      <strong>Provincia:</strong>{' '}
                      <span>{data.Paciente.Provincia || 'N/D'}</span>
                    </td>
                    <td>
                      <strong>Ciudad:</strong>{' '}
                      <span>{data.Paciente.Ciudad || 'N/D'}</span>
                    </td>
                    <td>
                      <strong>Dirección:</strong>{' '}
                      <span>{data.Paciente.Direccion || 'N/D'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Celular:</strong>{' '}
                      <span>{data.Paciente.Telefono}</span>
                    </td>
                    <td colSpan="2">
                      <strong>Recomendado por:</strong>{' '}
                      <span>{data.Paciente.RecomendadoPor || 'N/D'}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset>

            {/* Sección 3: Historia Médica */}
            <fieldset
              style={{
                border: '1px solid #000',
                padding: '10px',
                marginBottom: '15px',
              }}
            >
              <legend>
                <strong>3. Historia Médica</strong>
              </legend>
              <ul style={{ paddingLeft: '20px' }}>
                <li>
                  <p>
                    <b>¿Padece de enfermedades sistémicas?</b>{' '}
                    <u>{data.EnfermedadesSistematicas}</u>
                  </p>
                  <p>
                    <b>Especifique:</b>{' '}
                    <div>{data.EspecifiqueEnfermedadesSistematica}</div>
                  </p>
                </li>
                <br />
                <li>
                  <p>
                    <b>¿Ha sido sometido a cirugía?</b> <u>{data.Cirugias}</u>
                  </p>
                  <p>
                    <b>Especifique:</b> <div>{data.EspecifiqueCirugias}</div>
                  </p>
                </li>
                <br />
                <li>
                  <p>
                    <b>
                      ¿Le han colocado marcapasos u algún elemento no orgánico?
                    </b>{' '}
                    <u>{data.ElementoNoOrganico}</u>
                  </p>
                  <p>
                    <b>Especifique:</b>{' '}
                    <div>{data.EspecifiqueElementoNoOrganico}</div>
                  </p>
                </li>
                <br />
                <li>
                  <p>
                    <b>¿Está bajo tratamiento médico?</b>{' '}
                    <u>{data.BajoTratamientoMedico}</u>
                  </p>
                  <p>
                    <b>Especifique:</b>{' '}
                    <div>{data.EspecifiqueBajoTratamientoMedico}</div>
                  </p>
                </li>
                <br />
                <li>
                  <p>
                    <b>¿Toma alguna medicina?</b>{' '}
                    <u>{data.TomaAlgunaMedicina}</u>
                  </p>
                  <p>
                    <b>Especifique:</b>{' '}
                    <div>{data.EspecifiqueTomaMedicina}</div>
                  </p>
                </li>
                <br />
                <li>
                  <p>
                    <b>¿Es alérgico a alguna medicina?</b>{' '}
                    <u>{data.AlergicoMedicina}</u>
                  </p>
                  <p>
                    <b>Especifique:</b>{' '}
                    <div>{data.EspecifiqueAlergicoMedicina}</div>
                  </p>
                </li>
                <br />
                <li>
                  <p>
                    <b>¿Es propenso a hemorragias?</b>{' '}
                    <u>{data.PropensoHemorragias}</u>
                  </p>
                  <p>
                    <b>Especifique:</b>{' '}
                    <div>{data.EspecifiquePropensoHemorragias}</div>
                  </p>
                </li>
                <br />
              </ul>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td>
                      <strong>Tipo de sangre:</strong>{' '}
                      <span>{data.TipoDeSangre}</span>
                    </td>
                    <td>
                      <strong>Presión arterial:</strong>{' '}
                      <span>{data.PresionArterial}</span>
                    </td>
                    <td>
                      <strong>Pulso:</strong> <span>{data.Pulso}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset>

            {/* Sección 5: Declaración */}
            <fieldset
              style={{
                border: '1px solid #000',
                padding: '10px',
                marginBottom: '15px',
                textAlign: 'center',
              }}
            >
              <legend>
                <strong>5. Declaración</strong>
              </legend>
              <p>
                Declaro que los datos proporcionados son verídicos y me
                comprometo a comunicar cualquier cambio de esta información para
                contribuir a una atención acertada y confiable.
              </p>
              <div style={{ marginTop: 60 }}>
                <p>__________________________________________</p>
                <p>
                  <b>Paciente y/o Representante</b>
                </p>
                <p>C.C. #: {data.Paciente.Cedula}</p>
              </div>
            </fieldset>
            <div style={{ width: '100%' }}>
              <img
                style={{ height: 200, width: '50%' }}
                src={img1}
                alt="img1"
              />
              <img
                style={{ height: 380, width: '50%' }}
                src={img2}
                alt="img2"
              />
            </div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '20px',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Tratamiento</th>
                  <th style={thStyle}>Pieza</th>
                  <th style={thStyle}>Detalle Odontológico</th>
                  <th style={thStyle}>V. Uni</th>
                  <th style={thStyle}>V. T</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(7)].map((_, i) => (
                  <tr key={i}>
                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;

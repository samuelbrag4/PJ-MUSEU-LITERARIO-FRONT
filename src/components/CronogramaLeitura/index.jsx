'use client';
import { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaTimes, 
  FaCheck,
  FaBook,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import apiService from '../../services/api';
import styles from './cronogramaLeitura.module.css';

export default function CronogramaLeitura({ isOpen, onClose }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    titulo: '',
    descricao: '',
    tipo: 'EVENTO',
    livroId: null
  });

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    if (isOpen) {
      carregarEventos();
    }
  }, [isOpen, currentDate]);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      const mes = currentDate.getMonth() + 1;
      const ano = currentDate.getFullYear();
      
      const response = await apiService.getMeuCronograma({ mes, ano });
      setEventos(response || []);
    } catch (error) {
      console.error('Erro ao carregar cronograma:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior (vazios)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return eventos.filter(evento => {
      const eventDate = new Date(evento.data).toISOString().split('T')[0];
      return eventDate === dateString;
    });
  };

  const handleDayClick = (day) => {
    if (!day) return;
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setEventForm({
      titulo: '',
      descricao: '',
      tipo: 'EVENTO',
      livroId: null
    });
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const eventData = {
        ...eventForm,
        data: selectedDate.toISOString().split('T')[0]
      };

      if (editingEvent) {
        await apiService.atualizarEventoCronograma(editingEvent.id, eventData);
      } else {
        await apiService.criarEventoCronograma(eventData);
      }

      setShowEventModal(false);
      carregarEventos();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    }
  };

  const handleEditEvent = (evento) => {
    setEditingEvent(evento);
    setEventForm({
      titulo: evento.titulo,
      descricao: evento.descricao || '',
      tipo: evento.tipo,
      livroId: evento.livroId
    });
    setSelectedDate(new Date(evento.data));
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventoId) => {
    if (!confirm('Tem certeza que deseja deletar este evento?')) return;
    
    try {
      await apiService.deletarEventoCronograma(eventoId);
      carregarEventos();
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
    }
  };

  const handleToggleEvent = async (eventoId) => {
    try {
      await apiService.toggleEventoCronograma(eventoId);
      carregarEventos();
    } catch (error) {
      console.error('Erro ao alterar status do evento:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FaCalendarAlt /> Cronograma de Leitura
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.calendarContainer}>
          {/* Navegação do Calendário */}
          <div className={styles.calendarHeader}>
            <button className={styles.navButton} onClick={handlePrevMonth}>
              <FaChevronLeft />
            </button>
            <h3 className={styles.monthYear}>
              {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button className={styles.navButton} onClick={handleNextMonth}>
              <FaChevronRight />
            </button>
          </div>

          {/* Dias da Semana */}
          <div className={styles.weekDays}>
            {diasSemana.map(day => (
              <div key={day} className={styles.weekDay}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendário */}
          <div className={styles.calendar}>
            {getDaysInMonth().map((day, index) => {
              const eventsForDay = getEventsForDate(day);
              const hasEvents = eventsForDay.length > 0;
              
              return (
                <div
                  key={index}
                  className={`${styles.calendarDay} ${
                    day ? styles.validDay : styles.emptyDay
                  } ${hasEvents ? styles.hasEvents : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  {day && (
                    <>
                      <span className={styles.dayNumber}>{day}</span>
                      {hasEvents && (
                        <div className={styles.eventDots}>
                          {eventsForDay.slice(0, 3).map((evento, idx) => (
                            <div
                              key={idx}
                              className={`${styles.eventDot} ${
                                evento.concluido ? styles.completed : ''
                              }`}
                              title={evento.titulo}
                            />
                          ))}
                          {eventsForDay.length > 3 && (
                            <div className={styles.moreEvents}>
                              +{eventsForDay.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lista de Eventos do Mês */}
          <div className={styles.eventsList}>
            <h3 className={styles.eventsTitle}>Eventos do Mês</h3>
            {loading ? (
              <div className={styles.loading}>Carregando eventos...</div>
            ) : eventos.length > 0 ? (
              <div className={styles.eventsContainer}>
                {eventos.map(evento => (
                  <div
                    key={evento.id}
                    className={`${styles.eventItem} ${
                      evento.concluido ? styles.eventCompleted : ''
                    }`}
                  >
                    <div className={styles.eventHeader}>
                      <div className={styles.eventDate}>
                        {new Date(evento.data).toLocaleDateString('pt-BR')}
                      </div>
                      <div className={styles.eventActions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleToggleEvent(evento.id)}
                          title={evento.concluido ? 'Marcar como pendente' : 'Marcar como concluído'}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleEditEvent(evento)}
                          title="Editar evento"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleDeleteEvent(evento.id)}
                          title="Deletar evento"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className={styles.eventContent}>
                      <h4 className={styles.eventTitle}>{evento.titulo}</h4>
                      {evento.descricao && (
                        <p className={styles.eventDescription}>{evento.descricao}</p>
                      )}
                      {evento.livro && (
                        <div className={styles.eventBook}>
                          <FaBook /> {evento.livro.titulo}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noEvents}>
                <FaCalendarAlt />
                <p>Nenhum evento neste mês. Clique em um dia para criar!</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Evento */}
        {showEventModal && (
          <div className={styles.eventModalOverlay} onClick={() => setShowEventModal(false)}>
            <div className={styles.eventModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.eventModalHeader}>
                <h3>
                  {editingEvent ? 'Editar Evento' : 'Novo Evento'} - {' '}
                  {selectedDate?.toLocaleDateString('pt-BR')}
                </h3>
                <button
                  className={styles.eventModalClose}
                  onClick={() => setShowEventModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleEventSubmit} className={styles.eventForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Título</label>
                  <input
                    type="text"
                    value={eventForm.titulo}
                    onChange={(e) => setEventForm({...eventForm, titulo: e.target.value})}
                    className={styles.formInput}
                    required
                    placeholder="Ex: Terminar Dom Casmurro"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Descrição</label>
                  <textarea
                    value={eventForm.descricao}
                    onChange={(e) => setEventForm({...eventForm, descricao: e.target.value})}
                    className={styles.formTextarea}
                    rows="3"
                    placeholder="Ex: Ler os últimos 5 capítulos do livro"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tipo</label>
                  <select
                    value={eventForm.tipo}
                    onChange={(e) => setEventForm({...eventForm, tipo: e.target.value})}
                    className={styles.formSelect}
                  >
                    <option value="EVENTO">Evento</option>
                    <option value="META">Meta</option>
                    <option value="LEMBRETE">Lembrete</option>
                  </select>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setShowEventModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles.saveButton}>
                    {editingEvent ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
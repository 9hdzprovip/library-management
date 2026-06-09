import { Edit2, Trash2, Layers, Eye, BookOpen } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import bookImage from '../../../assets/images/books.png';

function BookGrid({ books = [], loading = false, onEdit, onDelete, onViewDetails, onBorrow, isAdmin }) {
  if (loading) {
    return (
      <div className="book-grid__loading">
        <p>Đang tải dữ liệu sách...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="book-grid__empty">
        <p>Không có sách nào khớp với tìm kiếm.</p>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {books.map((book) => {
        const available = book.availableQuantity || 0;

        return (
          <div key={book.id} className="book-card-alt">
            {/* Clickable Card Body to view detail */}
            <div 
              className="book-card-alt__main-click" 
              onClick={() => onViewDetails && onViewDetails(book)} 
              title="Click để xem chi tiết"
            >
              {/* Top Title */}
              <h3 className="book-card-alt__title" title={book.title}>
                {book.title}
              </h3>

              {/* Sub-label */}
              <div className="book-card-alt__sub">Thông tin chi tiết</div>

              {/* Content Area: Left list (quantity only), Right image */}
              <div className="book-card-alt__body">
                <div className="book-card-alt__details">
                  <div className="book-card-alt__detail-item">
                    <Layers size={14} className="book-card-alt__detail-icon" />
                    <span className="book-card-alt__detail-label">Số lượng sách còn:</span>
                    <strong className="book-card-alt__detail-val">{available}</strong>
                  </div>
                </div>

                {/* Right Side Book Graphic */}
                <div className="book-card-alt__graphic">
                  <img src={bookImage} alt="Book cover icon" className="book-card-alt__img" />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="book-card-alt__actions">
              {isAdmin ? (
                <>
                  <Button 
                    variant="secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit && onEdit(book);
                    }} 
                    className="book-card-alt__btn book-card-alt__btn--secondary"
                  >
                    <Edit2 size={14} /> Sửa
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete && onDelete(book);
                    }} 
                    className="book-card-alt__btn book-card-alt__btn--danger"
                  >
                    <Trash2 size={14} /> Xóa
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails && onViewDetails(book);
                    }} 
                    className="book-card-alt__btn book-card-alt__btn--secondary"
                  >
                    <Eye size={14} /> Chi tiết
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onBorrow && onBorrow(book);
                    }} 
                    className="book-card-alt__btn book-card-alt__btn--primary"
                    disabled={available === 0}
                  >
                    <BookOpen size={14} /> Mượn sách
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BookGrid;

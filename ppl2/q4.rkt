#lang racket
(provide (all-defined-out))

;; Add a contract here
(define shift-left
  (lambda (ls)
    (if(equal? (length ls) 0)
       ls
       (if(equal? (length ls) 1)
          ls
          (append(cdr ls)(cons(car ls)'()))))))


;TEST - shift-left
;(shift-left '())
;(shift-left '(5))
;(shift-left '(1 2 3 4))
;(shift-left '(1 (2 3) 4))

;; Add a contract here
(define shift-k-left
  (lambda (ls k)
    (if(equal? k 0)
       ls
       (shift-k-left (shift-left ls) (- k 1)))))

;TEST - shift-k-left
;(shift-k-left '() 2)
;(shift-k-left '(1 2) 2)
;(shift-k-left '(1 2 3 4) 3)
;(shift-k-left '(1 2 3 4 5 6) 4)

;; Add a contract here
(define shift-right
  (lambda (ls)
    (if (equal? (length ls) 0)
        ls
        (if(equal? (length ls) 1)
           ls
           (append (cons (last ls) '())(take ls (- (length ls) 1)))))))

;TEST - shift-right
;(shift-right '())
;(shift-right '(1 2))
;(shift-right '(1 2 3 4))
;(shift-right '(1 2 3 4 5 6))

;; Add a contract here
(define combine
  (lambda (ls1 ls2)
    (if (equal? (length ls1) 0)
        ls2
        (if (equal? (length ls2) 0)
            ls1
            (append (cons (car ls1) '()) (append (cons (car ls2) '()) (combine (cdr ls1) (cdr ls2))))))))

;TEST - combine
;(combine '() '())
;(combine '(1 2 3) '())
;(combine '() '(4 5 6))
;(combine '(1 3) '(2 4))
;(combine '(1 3) '(2 4 5 6))
;(combine '(1 2 3 4) '(5 6))

;; Add a contract here
(define sum-tree
  (lambda (tree)
    (if (equal? (length tree) 0)
        0
        (if (number? (car tree))
            (+ (car tree) (sum-tree (cdr tree)))
            (+ (sum-tree (car tree)) (sum-tree (cdr tree)))))))

;TEST - sum-tree
;(sum-tree '())
;(sum-tree '(5))
;(sum-tree '(5 (1 (2) (3))))
;(sum-tree '(5 (1 (2) (3) (6)) (7)))
;(sum-tree '(5 (1 (2) (3 (12) (12)) (6)) (7)))


;; Add a contract here
(define inverse-tree
  (lambda (tree)
    (if (equal? (length tree) 0)
        tree
        (if(number? (car tree))
           (append (cons (* (car tree) -1) '()) (inverse-tree (cdr tree)))
           (if (boolean? (car tree))
               (append (cons (not (car tree)) '()) (inverse-tree (cdr tree)))
               (cons (inverse-tree (car tree)) (inverse-tree (cdr tree))))))))

;TEST - inversed-tree
;(inverse-tree '())
;(inverse-tree '(5))
;(inverse-tree '(#t))
;(inverse-tree '(#f))
;(inverse-tree '(-5 (1 (-2) (3) (#f)) (#t)))
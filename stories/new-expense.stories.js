import { toast } from '../src/components/toast.js';
import { h, money, svg } from './_shared.js';

export default { title: 'Examples/NewExpense', parameters: { layout: 'fullscreen' } };

const categories = [['comida', 'Comida'], ['transporte', 'Transporte'], ['oficina', 'Oficina'], ['software', 'Software'], ['viajes', 'Viajes'], ['servicios', 'Servicios']];
const IVA = 0.16;

export const RegisterExpense = {
  render: () => {
    const rows = [];
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .ne{max-width:68rem;margin:0 auto;padding:2rem 1.25rem}
        .ne .muted{color:var(--ui-muted)}
        .ne .line{display:flex;justify-content:space-between;align-items:center;gap:1rem}
        .ne .big{font-size:1.7rem;font-weight:800;letter-spacing:-.02em}
      </style>
      <div class="ne">
        <ui-stack gap="xl">
          <ui-page-header heading="Registrar gasto" description="Captura el gasto, adjunta el comprobante y marca si es deducible." divider>
            <ui-breadcrumb slot="breadcrumb"><a href="#">Gastos</a><span>Nuevo</span></ui-breadcrumb>
          </ui-page-header>

          <ui-split aside-width="19rem" gap="lg" sticky>
            <ui-card padding="lg">
              <form novalidate>
                <ui-stack gap="lg">
                  <ui-grid cols="1" cols-sm="2">
                    <ui-input name="concept" label="Concepto" required style="grid-column:1/-1"></ui-input>
                    <ui-input name="amount" type="number" label="Monto (sin IVA)" required min="1" step="0.01"><span slot="start">$</span></ui-input>
                    <ui-date-picker name="date" label="Fecha" required></ui-date-picker>
                    <ui-combobox name="category" label="Categoría" allow-custom clearable required>
                      ${categories.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}
                    </ui-combobox>
                    <ui-segmented name="method" value="card" label="Método de pago">
                      <option value="card">Tarjeta</option><option value="cash">Efectivo</option><option value="transfer">Transferencia</option>
                    </ui-segmented>
                  </ui-grid>
                  <ui-tag-input name="tags" label="Etiquetas" max="5" hint="Para filtrar después"></ui-tag-input>
                  <ui-file-upload name="receipts" label="Comprobantes" multiple accept=".pdf,.xml,image/*" max-size="5" max-files="3"></ui-file-upload>
                  <ui-textarea name="notes" label="Notas" autosize rows="2" maxrows="5"></ui-textarea>
                  <div class="line">
                    <span>Deducible de impuestos<br><span class="muted" style="font-size:.85rem">Se suma el IVA al total</span></span>
                    <ui-toggle name="deductible" checked label="Deducible"></ui-toggle>
                  </div>
                  <ui-stack direction="row" gap="sm" justify="end">
                    <ui-button type="reset" variant="ghost">Limpiar</ui-button>
                    <ui-button type="submit">${svg('check', 16, 'start')}Guardar gasto</ui-button>
                  </ui-stack>
                </ui-stack>
              </form>
            </ui-card>

            <ui-card slot="aside" variant="soft" padding="lg">
              <span slot="header">Resumen</span>
              <ui-stack gap="sm" divider>
                <div class="line"><span class="muted">Subtotal</span><span class="sub">$0</span></div>
                <div class="line"><span class="muted">IVA (16%)</span><span class="iva">$0</span></div>
                <div class="line"><strong>Total</strong><span class="big tot">$0</span></div>
              </ui-stack>
              <ui-badge class="ded" slot="footer" tone="success" dot>Deducible</ui-badge>
            </ui-card>
          </ui-split>

          <ui-stack gap="lg">
            <ui-text variant="h3">Gastos recientes</ui-text>
            <ui-empty-state class="empty" heading="Aún no registras gastos" description="Guarda el primero y aparecerá aquí." bordered size="sm">
              ${svg('file', 24, 'icon')}
            </ui-empty-state>
            <ui-table class="tbl" compact hidden label="Gastos recientes"></ui-table>
          </ui-stack>
        </ui-stack>
      </div>`;

    const $ = (s) => el.querySelector(s);
    const form = $('form');
    const tbl = $('.tbl');
    tbl.columns = [
      { key: 'concept', label: 'Concepto', sortable: true },
      { key: 'category', label: 'Categoría', sortable: true },
      { key: 'date', label: 'Fecha', sortable: true },
      { key: 'total', label: 'Total', sortable: true, align: 'right', render: (r) => money(r.total) },
      { key: 'ded', label: 'Deducible', render: (r) => h(`<ui-badge size="sm" tone="${r.ded ? 'success' : 'neutral'}">${r.ded ? 'Sí' : 'No'}</ui-badge>`) },
    ];

    const summary = () => {
      const d = new FormData(form);
      const amount = parseFloat(d.get('amount')) || 0;
      const ded = d.has('deductible');
      const iva = ded ? amount * IVA : 0;
      $('.sub').textContent = money(amount);
      $('.iva').textContent = money(iva);
      $('.tot').textContent = money(amount + iva);
      $('.ded').textContent = ded ? 'Deducible' : 'No deducible';
      $('.ded').setAttribute('tone', ded ? 'success' : 'neutral');
    };
    form.addEventListener('input', summary);
    form.addEventListener('change', summary);
    form.addEventListener('reset', () => setTimeout(summary));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = [...form.querySelectorAll('ui-input, ui-date-picker, ui-combobox, ui-file-upload, ui-tag-input')].find((f) => !f.checkValidity());
      if (bad) return bad.reportValidity();
      const d = new FormData(form);
      const amount = parseFloat(d.get('amount'));
      const ded = d.has('deductible');
      rows.unshift({
        concept: d.get('concept'), category: d.get('category'), date: d.get('date'),
        total: amount * (ded ? 1 + IVA : 1), ded,
      });
      tbl.rows = [...rows];
      tbl.hidden = false;
      $('.empty').hidden = true;
      toast.success(`${d.get('concept')} guardado`, { title: 'Gasto registrado' });
      form.reset();
    });

    summary();
    return el;
  },
};

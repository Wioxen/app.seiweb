var dataLog = undefined;
var modalLog = undefined;
var cadastroLog = undefined;
var resourceLog = "LogDeAtividade";
    
function DetailLog (d) {
    console.log(d);
    return `
    <div class="row">
    <div class="col-12">
    <ul class="list-group list-group-flush w-100">
        <li class="list-group-item d-flex justify-content-between align-items-center">
            IP
            <small>${d.ip}</small>
        </li>
        <li class="list-group-item">
            ${d.user_agent}
        </li>
    </ul>
    </div>
    </div>
    `;
}

function LogDeAtividadeClick(e){
    event.preventDefault();
    var $this = $(e);

    const defaultColumns = [
        {
            data: 'sucesso',
            orderable: false,
            "width": "16px;",
            "render": function(data, type, row) {
                return `<i class="fa fa-${(data === true) ? 'check':'ban'} text-${(data === true) ? 'success':'danger'}"></i>`                        
            }            
        },
        {
            data: 'created_at',
            orderable: false
        },
        {
            data: 'usuario_nome',
            orderable: false
        },
        {
            data: 'descricao',
            orderable: false
        },
        {
            data: 'modulo',
            orderable: false
        },
        {
            data: 'acao',
            orderable: false
        },
    ];

    cadastroLog = 
        CarregaDataTable
        (
            'datatable/'+resourceLog,
            '',
            'modal-xl',
            `<table id="${resourceLog}Tb" class="row-border stripe hover" style="width:100%"></table>`,
            "<span></span>",
            null,
            defaultColumns,
            function(settings)
            {
            },
            false,
            DetailLog
        );           
        
    cadastroLog.modal.find('.modal-title').html('<i class="fa fa-history"></i> Log de atividades');        
}
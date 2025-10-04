function GetModuloAcessos(onSuccessCallback)
{
    RestRequest('GET',
        $baseApiUrl+"modulo",
        null,
        function(xhr){
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        function(response, status, xhr){
            $('#modulesList').empty();
            $('#moduleacessos').empty();

            $.each(response,function(i,v){
                $('#modulesList').append(`<li class="list-group-item p-0">
                            <a href="#" id="modulo${v.id}" data-id="${v.id}" class="list-group-item list-group-item-module border-0 list-group-item-action d-flex justify-content-between align-items-center">
                                ${v.titulo}
                                <span class="badge bg-warning text-dark rounded-pill">${v.menu}</span>
                            </a>                            
                        </li>`);

                $('#moduleBotao').append(`<button id="btn-modulo${v.id}" data-module="modulo${v.id}" class="btn btn-sm w-100 btn-light btn-module ${(i === 0) ? '':'d-none'}">Marcar Todos</button>`);                            

                $.each(v.acessos,function(idx,val){
                    $('#moduleacessos').append(`<label class="list-group-item list-group-item-acesso d-none modulo${v.id}">
                        <input id="${val.codigo}" class="form-check-input me-1 ${val.parent}" type="checkbox" data-parent="${val.parent}" value="">
                        ${val.descricao}
                    </label>`);
                });                              
            });

            $('.form-check-input').change(function(){
                const $this = $(this);

                if (($this.data('parent') === null) && ($('.'+$this.attr('id')).is(':checked')))
                {
                    $this.prop('checked', true);
                    return;
                } 
                
                const dataParent = $('#'+$this.data('parent'));
                
                // Verificação completa em uma linha
                if (!dataParent || !$(dataParent).length || !$(dataParent).is('input[type="checkbox"]')) {
                    console.warn('data-parent inválido ou elemento não encontrado');
                    return;
                }
                
                const $parentCheckbox = $(dataParent);
                
                if ($this.is(':checked')) {
                    $parentCheckbox.prop('checked', true);
                } else if (!$parentCheckbox.is(':checked')) {
                    $parentCheckbox.prop('checked', false);
                }
            });

            $('.btn-module').click(function(e){
                e.preventDefault();
                var $thisBotao = $(this);
                if ($.trim($thisBotao.text()) === 'Marcar Todos'){
                    $thisBotao
                    .text('Desmarcar Todos');
                    $(`.${$thisBotao.data('module')}`).find('input[type="checkbox"]').prop('checked',true);
                } else {
                    $thisBotao
                    .text('Marcar Todos');
                    $(`.${$thisBotao.data('module')}`).find('input[type="checkbox"]').prop('checked',false);
                }
            });                

            $('.list-group-item-module').click(function(){
                var $this = $(this);
                $('.list-group-item-module').removeClass('active');
                $this.addClass('active');

                $('.list-group-item-acesso').addClass('d-none');
                $('.'+$(this).attr('id')).removeClass('d-none');

                $('.btn-module').addClass('d-none');
                $('#btn-'+$(this).attr('id')).removeClass('d-none');
            });

            $('.list-group-item-module').first().trigger('click');

            if (typeof onSuccessCallback === 'function') {
                onSuccessCallback(response, status, xhr);
            }            
        });       
}
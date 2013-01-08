  /*
   *
   *
   * permissions
   *
   * ids that end in 'skel' are only used as elements
   * to clone into real form elements that are then
   * submitted
   */

  // input for uids -  attach function to verify uid
  $('#new_user_name_skel').on('blur', function() {
      // clear out any existing messages
      $('#directory_user_result').html('');
      var un = $('#new_user_name_skel').val();
      var perm = $('#new_user_permission_skel').val();
      if ( $.trim(un).length == 0 ) {
        return;
      }
      $.ajax( {
        url: "/directory/user/" + un,
        success: function( data ) {
          if (data != null) {
            if (!data.length) {
              $('#directory_user_result').html('User id ('+un+ ') does not exist.');
              $('#new_user_name_skel').select();
              $('#new_user_permission_skel').val('none');
              return;
            }
            else {
              $('#new_user_permission_skel').focus();
            }
          }
        }
      });

  });


  // add button for new user
  $('#add_new_user_skel').on('click', function() {
      if ($('#new_user_name_skel').val() == "" || $('#new_user_permission_skel :selected').index() == "0") {
        $('#new_user_name_skel').focus();
        return false;
      }

      if ($('#new_user_name_skel').val() == $('#file_owner').html()) {
        $('#permissions_error_text').html("Cannot change owner permissions.");
        $('#permissions_error').show();
        $('#new_user_name_skel').val('');
        $('#new_user_name_skel').focus();
        return false;
      }

      if (!is_permission_duplicate($('#new_user_name_skel').val())) {
        $('#permissions_error_text').html("This user already has a permission.");
        $('#permissions_error').show();
        $('#new_user_name_skel').focus();
        return false;
      }
      $('#permissions_error').html();
      $('#permissions_error').hide();

      var un = $('#new_user_name_skel').val();
      var perm_form = $('#new_user_permission_skel').val();
      var perm = $('#new_user_permission_skel :selected').text();
      // clear out the elements to add more
      $('#new_user_name_skel').val('');
      $('#new_user_permission_skel').val('none');

      addPerm(un, perm_form, perm, 'new_user_name');
      return false;
  });

  // add button for new user
  $('#add_new_group_skel').on('click', function() {
      if ($('#new_group_name_skel :selected').index() == "0" || $('#new_group_permission_skel :selected').index() == "0") {
        $('#new_group_name_skel').focus();
        return false;
      }
      var cn = $('#new_group_name_skel').val();
      var perm_form = $('#new_group_permission_skel').val();
      var perm = $('#new_group_permission_skel :selected').text();

      if (!is_permission_duplicate($('#new_group_name_skel').val())) {
        $('#permissions_error_text').html("This group already has a permission.");
        $('#permissions_error').show();
        $('#new_group_name_skel').focus();
        return false;
      }
      $('#permissions_error').html();
      $('#permissions_error').hide();
      // clear out the elements to add more
      $('#new_group_name_skel').val('');
      $('#new_group_permission_skel').val('none');

      addPerm(cn, perm_form, perm, 'new_group_name');
      return false;
  });

  function addPerm(un, perm_form, perm, perm_type)
  {
      var tr = $(document.createElement('tr'));
      var td1 = $(document.createElement('td'));
      var td2 = $(document.createElement('td'));
      var remove = $('<button class="btn close">X</button>');

      $('#save_perm_note').show();

      $('#new_perms').append(td1);
      $('#new_perms').append(td2);

      td1.html('<label class="control-label">'+un+'</label>');
      td2.html(perm);
      td2.append(remove);
      remove.click(function () {
        tr.remove();
      });

      $('<input>').attr({
          type: 'hidden',
          name: 'generic_file[permissions]['+perm_type+']['+un+']',
          value: perm_form
        }).appendTo(td2);
      tr.append(td1);
      tr.append(td2);
      $('#file_permissions').after(tr);
      tr.effect("highlight", {}, 3000);
  }

  $('.remove_perm').on('click', function() {
     var top = $(this).parent().parent();
     top.hide(); // do not show the block
     top.find('.select_perm')[0].options[0].selected= true; // select the first otion which is none
     return false;

  });


const jsPath = './assets/js/'
const $ganttTable = $('.gaintt-table')

const shiftPlanner = {
  "data": [
    {
      "id": "55648",
      "type": "tasks",
      "attributes": {
        "inter-location-task-id": 55649,
        "customer-id": 1148,
        "customer": "Demo-Customer",
        "worker-id": 2441,
        "worker": "Jonathon Weiss",
        "latitude": null,
        "longitude": null,
        "radius": 0.0,
        "start-on": "2020-09-07 09:15",
        "complete-on": "2020-09-07 14:32",
        "started-on": null,
        "completed-on": null,
        "address": "147 Lakeview WayEmerald Hills, CA 94062",
        "kind": "refuel",
        "status": "scheduled",
        "driver-acceptance": "pending",
        "vehicles": {},
        "title": null,
        "refueling-status": null,
        "delivery-instruction": "Check-in with reception",
        "skus": {},
        "note": null
      }
    },
    {
      "id": "55650",
      "type": "tasks",
      "attributes": {
        "inter-location-task-id": 55651,
        "customer-id": 1149,
        "customer": "Test-Customer",
        "worker-id": 2442,
        "worker": "Kentavious Caldwell-Pope",
        "latitude": null,
        "longitude": null,
        "radius": 0.0,
        "start-on": "2020-09-07 04:30",
        "complete-on": "2020-09-07 07:10",
        "started-on": null,
        "completed-on": null,
        "address": "147 Lakeview WayEmerald Hills, CA 94062",
        "kind": "refuel",
        "status": "scheduled",
        "driver-acceptance": "pending",
        "vehicles": {},
        "title": null,
        "refueling-status": null,
        "delivery-instruction": "Check-in with reception",
        "skus": {},
        "note": null
      }
    }
  ]
}

const newTask = {
  "id": "55555",
  "type": "tasks",
  "attributes": {
    "inter-location-task-id": 55649,
    "customer-id": 1148,
    "customer": "New-Customer",
    "worker-id": 2441,
    "worker": "Susan Hiddleman",
    "latitude": null,
    "longitude": null,
    "radius": 0.0,
    "start-on": "2020-09-07 01:15",
    "complete-on": "2020-09-07 04:32",
    "started-on": null,
    "completed-on": null,
    "address": "147 Lakeview WayEmerald Hills, CA 94062",
    "kind": "refuel",
    "status": "scheduled",
    "driver-acceptance": "pending",
    "vehicles": {},
    "title": null,
    "refueling-status": null,
    "delivery-instruction": "Check-in with reception",
    "skus": {},
    "note": null
  }
}

let defualtGanttView = 'daily'

$.getScript(`${jsPath}collaspable.js`, function(){
  activateCollaspable()
})

$('.data-view .btn-group .btn').click(function() {
  defualtGanttView = $(this).data('view')
  activateDefaultViewBtn()
})

activateDefaultViewBtn()

function activateDefaultViewBtn() {
  $('.data-view .btn-group .btn').removeClass('active')
  $(`.data-view .btn-group .btn[data-view="${defualtGanttView}"]`).addClass('active')

  loadGainttTable()
}

function loadGainttTable() {
  const columns = timeOneDay()
  loadGainttTableHeader(columns)
  loadGainttTableBody(columns)
  populatedatatoGantt(columns)
}

function timeOneDay(){
  const hoursPerDay = 24;
  let time = [];
  let formattedTime;
  
  for(i = 0; i < hoursPerDay+1 ; i++) { //fill in all of the hours
      formattedTime = (moment().startOf('day').subtract(i, "hours")).format("HH:00");  //give the time in format X AM/PM
      time.unshift(formattedTime);  //add to beginning of array
  }                                //do this for all 24 hours
  time.pop()

  return time
}

function loadGainttTableHeader(columns) {
  let thead = '<th class="customers"></th>'

  columns.forEach(c => {
    thead += `
      <th class="time" data-time="${c}"><div class="time-label">${c}</div></th>
    `
  })
  
  $ganttTable.find('thead tr').html(thead)
}

function loadGainttTableBody(columns) {
  let tbody = ''

  shiftPlanner.data.forEach(d => {
    let columnsHtml = `<th class="workers">${d.attributes.worker}</th>`

    columns.forEach(c => {
      columnsHtml += `
        <td class="time droppable" data-time="${c}"></td>
      `
    })

    tbody += `
      <tr id="tr-${d.id}">
        ${columnsHtml}
      </tr>
    ` 
  })

  $ganttTable.find('tbody').html(tbody)
}

function populatedatatoGantt() {
  shiftPlanner.data.forEach(d => {
    const { attributes } = d
    const $currentRow = $ganttTable.find(`tr#tr-${d.id}`)
    const startBlock = $currentRow.find(`td.time[data-time="${formatDateTime(attributes['start-on'], 'HH')}:00"]`)
    const endBlock = $currentRow.find(`td.time[data-time="${formatDateTime(attributes['complete-on'], 'HH')}:00"]`)
    const distance = getDistanceBetweenTwoElements(startBlock, endBlock) + 100 - 6

    $(startBlock).html(createTask(d, distance))
  })

  initDraggableDroppable()
  initTooltipster()
}

function createTask(data, distance, reCreate= false) {
  const { attributes } = data
  const startTime = formatDateTime(attributes['start-on'], 'HH:mm')
  const endTime = formatDateTime(attributes['complete-on'], 'HH:mm')

  console.log('>>>> time', startTime, endTime)

  const marginLeftValue = formatDateTime(attributes['start-on'], 'mm')
  const marginRightValue = formatDateTime(attributes['complete-on'], 'mm')
  const maxValue = 60
  
  setCurrentTime('HH', 'mm', maxValue)
  setInterval(function(){
    setCurrentTime('HH', 'mm', maxValue)
  }, 1000);
  if (!reCreate) {
    scrollToCurrentTime('HH')
  }
  const margins = getTaskMargin(marginLeftValue, marginRightValue, maxValue)
  const style = `width: calc(${distance}px - ${margins.left}px - ${margins.right}px); margin-left: ${margins.left}px`

  return `
    <div
      class="task draggable"
      style="${style}"
      data-id="${data.id}"
      data-customer="${attributes.customer}"
      data-distance="${distance}"
    >
      <div class="remove-icon" title="remove">
        <i class="fas fa-times"></i>
      </div>
      <i class="fas fa-grip-vertical grip-icon"></i>
      <div class="task-content tooltip" title="${getToolTip(data)}">
        <strong>${attributes.customer}</strong>
        <span>US Oil & Ref</span>
        <span>BPC WC</span>
        <span>990 gal - UL, D5UL</span>
      </div>
    </div>
  `
}

function placeTask(droppedZone, droppedItem) {
  let droppedTask
  if ($(droppedItem).data('card') == 'new') {
    droppedTask = newTask
    shiftPlanner.data.push(droppedTask)
  } else {
    droppedTask = shiftPlanner.data.find(d => d.id == $(droppedItem).data('id'))
  }
  if (droppedTask.id) {
    const { attributes } = droppedTask
    const startBlock = $(droppedZone).parent('tr').find(`td.time[data-time="${droppedZone.attr('data-time')}"]`)
    const endBlock = $(droppedZone).parent('tr').find(`td.time[data-time="${formatDateTime(attributes['complete-on'], 'HH')}:00"]`)
    const distance = getDistanceBetweenTwoElements(startBlock, endBlock) + 100 - 6
  
    if ($(droppedItem).data('card') != 'new') {
      $(droppedItem).remove()
    }
    $(startBlock).html(createTask(droppedTask, distance, true))
    
    initDraggableDroppable(droppedItem)
    initTooltipster()
  } else {
    console.log('>>> task not found')
  }
}

function getToolTip(data) {
  const { attributes } = data
  return `
    <div class=task-tooltip>
      <div class=order-number>41982929-X42</div>
      <div><strong>${attributes.customer}</strong></div>
      <div>
        <span>Order Date:</span> ${formatDateTime(attributes['start-on'], 'MM/DD HH:mm')}
      </div>
      <div>
        <span>Site Code:</span> 0042
      </div>
      <div>
        Eugene Kinder Morgan<br/>
        - Low Rack
      </div>
      <div>
        <strong>990 gal</strong> - UL, D5UL
      </div>
      <div>
        <span>Site Code:</span> 0042
      </div>
    </div>
  `
}

function getTaskMargin(leftValue, rightValue, maxValue) {
  const marginLeft = Math.round((leftValue/maxValue) * 100)
  const marginRight = Math.round((rightValue/maxValue) * 100)

  return {
    left: marginLeft,
    right: marginRight
  }
}

function formatDateTime(dateTime, format = null, timeZone = null) {
  if (!dateTime) {
    return '';
  }
  
  if (timeZone) {
    return moment(dateTime).tz(timeZone).format(format);
  } else {
    return moment(dateTime).format(format);
  }
}

function getDistanceBetweenTwoElements($elem1, $elem2) {
  // get the bounding rectangles
  var div1rect = $elem1[0].getBoundingClientRect();
  var div2rect = $elem2[0].getBoundingClientRect();

  // get div1's center point
  var div1x = div1rect.left + div1rect.width/2;
  var div1y = div1rect.top + div1rect.height/2;

  // get div2's center point
  var div2x = div2rect.left + div2rect.width/2;
  var div2y = div2rect.top + div2rect.height/2;

  // calculate the distance using the Pythagorean Theorem (a^2 + b^2 = c^2)
  var distanceSquared = Math.pow(div1x - div2x, 2) + Math.pow(div1y - div2y, 2);
  return Math.sqrt(distanceSquared);
}

function setCurrentTime(mainTime, SubTime, maxValue) {
  $ganttTable.find('.time').removeClass (function (index, className) {
    return (className.match (/(^|\s)active-\S+/g) || []).join(' ');
  });
  $ganttTable.find('.time').removeClass('active')
  
  const currentTimeBlock = moment().format(mainTime) + ':00'
  const currentTime = moment().format(SubTime)
  const left = (Number(currentTime) / maxValue) * 100
  $ganttTable.find(`th.time[data-time="${currentTimeBlock}"]`).addClass(`active active-after-left-${Math.round(left+1)} active-after-height-${$ganttTable.innerHeight()-1}`)
}

function scrollToCurrentTime(mainTime) {
  const currentTimeBlock = moment().format(mainTime) + ':00'
  const currentTimeColumn = $ganttTable.find(`th.time[data-time="${currentTimeBlock}"]`)
  // scroll to selected state label
  var $scroller = $ganttTable.parent('.accordion-body');
  var scrollTo = currentTimeColumn.position().left - ($scroller.innerWidth() / 2)
  $scroller.animate({'scrollLeft': scrollTo}, 0);
}

function initDraggableDroppable() {
  $('.draggable').draggable({
    cursor: "grabbing",
    containment: ".gaintt-table",
    scroll: true,
    scrollSensitivity: 100,
    revert: "invalid",
    start: function (event, ui) {
      $(this).css("z-index", 10);
    },
    start: function(e) {
      
    },
    drag: function(e) {
      
    },
    stop: function(e, ui) {
    }
  });

  $('.u-draggable').draggable({
    cursor: "grabbing",
    scrollSensitivity: 100,
    revert: "invalid",
    start: function (event, ui) {
      $(this).css("z-index", 10);
    },
    helper: function( event ) {
      console.log('>>>>', $(this).data('card'))
      const html = `
        <div class="task u-draggable" data-card="new">
          <i class="fas fa-grip-vertical grip-icon"></i>
          <div class="task-content"><strong>New Customer</strong></div>
        </div>
      `
      return $(html);
    }
  });

  $( ".droppable" ).droppable({
    hoverClass: "highlight",
    drop: function (event, ui) {
      const droppedZone = $(this);
      const droppedItem = ui.draggable;
      
      placeTask(droppedZone, droppedItem)
    }
  });
}

function initTooltipster(reInit = false) {
  $('.tooltip:not(".tooltipstered")').tooltipster({
    theme: 'tooltipster-shadow',
    animation: 'grow',
    trigger: 'click',
    position: 'bottom',
    contentAsHTML: true,
    interactive: true,
    touchDevices: false,
    maxWidth: 500,
    // plugins: ['follower']
  });
}

$('.remove-icon').click(function() {
  const taskElem = $(this).parent('.task')
  $(taskElem).remove()
  // debugger
})

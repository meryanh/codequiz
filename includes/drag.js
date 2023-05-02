(function(){
	var mouseX=0,
		mouseY=0,
		grabX=0,
		grabY=0,
		nextZ=1,
		grabElementX=0,
		grabElementY=0,
		grabElement=null,
		handleElement=null,
		endCallback;
	
	function startDrag(event, el, h, sb, eb){
		document.querySelector('.drag-overlay').style.display = 'block';
		if (event.touches){
			event = event.touches[0];
		}
		grabElement = el;
		handleElement = h;
		el.classList.add('dragging');
		var rect = el.getBoundingClientRect();
		grabElementX = rect.left;
		grabElementY = rect.top;
		grabX = event.clientX;
		grabY = event.clientY;
		endCallback=eb;
		try{
			if (sb)new Function('X', 'Y', sb).apply(el, [grabX, grabY]);
		}catch(ex){}
	}
	
	function stopDrag(event){
		document.querySelector('.drag-overlay').style.display = 'none';
		if (grabElement){
			if (event.touches){
				event = event.touches[0];
			}
			grabElement.classList.remove('dragging');
			try{
				if (endCallback)new Function('X', 'Y', endCallback).apply(grabElement, [mouseX, mouseY]);			
			}catch(ex){
			}finally{
				grabElement=null;
			}
		}
	}
	
	function updateLoc(event){
		if (grabElement){
			if (event.touches){
				event = event.touches[0];
			}
			mouseX = event.clientX;
			mouseY = event.clientY;
			var newX = grabElementX + (mouseX - grabX);
			var newY = grabElementY + (mouseY - grabY);
			
			if (newX + grabElement.offsetWidth > window.innerWidth)newX = window.innerWidth - grabElement.offsetWidth;
			if (newX < 0)newX = 0;
			if (newY + grabElement.offsetHeight > window.innerHeight)newY = window.innerHeight - grabElement.offsetHeight;
			if (newY < 0)newY = 0;

			grabElement.style.left = newX + "px";
			grabElement.style.top = newY + "px";
		}
	}
	window.addEventListener('touchmove', updateLoc);
	window.addEventListener('mousemove', updateLoc);
	
	window.addEventListener('touchend', stopDrag);
	window.addEventListener('mouseup', stopDrag);
	
	function initDraggable(){
		var list = document.querySelectorAll('[draggable]');
		for (i = 0; i < list.length; i++) {
			(function(element){
				element.style.position='absolute';
				element.removeAttribute('draggable');
				var sel=element.getAttribute('drag-handle'),
					begin=element.getAttribute('drag-start'),
					end=element.getAttribute('drag-end'),
					handle=sel?element.querySelector(sel):element;

				handle.addEventListener('touchstart', function(event){startDrag(event,element,handle,begin,end)});
				handle.addEventListener('mousedown', function(event){startDrag(event,element,handle,begin,end)});

				handle.classList.add('draggable');
				
				element.addEventListener('touchstart', function(){element.style.zIndex = (nextZ++)});
				element.addEventListener('mousedown', function(){element.style.zIndex = (nextZ++)});
			})(list[i])
		}
	}
	
	window.addEventListener('load', function(){
		initDraggable();
		setInterval(initDraggable, 1000);
	});
})();